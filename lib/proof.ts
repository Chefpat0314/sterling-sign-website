// lib/proof.ts - Proof management and status tracking
import { z } from 'zod';

// Proof Status Enum
export enum ProofStatus {
  PENDING = 'pending',
  SENT = 'sent',
  APPROVED = 'approved',
  CHANGES_REQUESTED = 'changes_requested',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

// Proof Schema
const ProofSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  status: z.nativeEnum(ProofStatus),
  createdAt: z.date(),
  sentAt: z.date().optional(),
  approvedAt: z.date().optional(),
  expiresAt: z.date(),
  version: z.number().default(1),
  artworkUrl: z.string().optional(),
  previewUrl: z.string().optional(),
  notes: z.string().optional(),
  requestedChanges: z.array(z.string()).optional(),
  approvedBy: z.string().optional(),
  approvedArtworkUrl: z.string().optional(),
});

export type Proof = z.infer<typeof ProofSchema>;

// Proof Request Schema
const ProofRequestSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  artworkUrl: z.string(),
  specifications: z.object({
    width: z.number(),
    height: z.number(),
    quantity: z.number(),
    material: z.string(),
    options: z.record(z.any()).optional(),
  }),
  notes: z.string().optional(),
});

export type ProofRequest = z.infer<typeof ProofRequestSchema>;

// Proof Response Schema
const ProofResponseSchema = z.object({
  proofId: z.string(),
  status: ProofStatus,
  message: z.string().optional(),
});

export type ProofResponse = z.infer<typeof ProofResponseSchema>;

// In-memory proof store (would be replaced with database)
let proofStore: Map<string, Proof> = new Map();
let proofCounter = 1;

// Proof creation
export function createProof(request: ProofRequest): Proof {
  const validated = ProofRequestSchema.parse(request);
  
  const proofId = `proof_${proofCounter++}_${Date.now()}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
  
  const proof: Proof = {
    id: proofId,
    orderId: validated.orderId,
    productId: validated.productId,
    status: ProofStatus.PENDING,
    createdAt: now,
    expiresAt,
    version: 1,
    artworkUrl: validated.artworkUrl,
    specifications: validated.specifications,
    notes: validated.notes,
  };
  
  proofStore.set(proofId, proof);
  return proof;
}

// Get proof by ID
export function getProof(proofId: string): Proof | null {
  return proofStore.get(proofId) || null;
}

// Get proofs by order ID
export function getProofsByOrder(orderId: string): Proof[] {
  return Array.from(proofStore.values()).filter(proof => proof.orderId === orderId);
}

// Update proof status
export function updateProofStatus(proofId: string, status: ProofStatus, metadata?: {
  approvedBy?: string;
  notes?: string;
  requestedChanges?: string[];
  approvedArtworkUrl?: string;
}): Proof | null {
  const proof = proofStore.get(proofId);
  if (!proof) return null;
  
  const now = new Date();
  const updatedProof: Proof = {
    ...proof,
    status,
    ...(status === ProofStatus.SENT && { sentAt: now }),
    ...(status === ProofStatus.APPROVED && { 
      approvedAt: now,
      approvedBy: metadata?.approvedBy,
      approvedArtworkUrl: metadata?.approvedArtworkUrl || proof.artworkUrl,
    }),
    ...(status === ProofStatus.CHANGES_REQUESTED && {
      requestedChanges: metadata?.requestedChanges,
    }),
    notes: metadata?.notes || proof.notes,
  };
  
  proofStore.set(proofId, updatedProof);
  return updatedProof;
}

// Check if proof is expired
export function isProofExpired(proof: Proof): boolean {
  return new Date() > proof.expiresAt;
}

// Get proof time remaining
export function getProofTimeRemaining(proof: Proof): {
  hours: number;
  minutes: number;
  totalMinutes: number;
  isExpired: boolean;
} {
  const now = new Date();
  const timeRemaining = proof.expiresAt.getTime() - now.getTime();
  const totalMinutes = Math.max(0, Math.floor(timeRemaining / (1000 * 60)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return {
    hours,
    minutes,
    totalMinutes,
    isExpired: timeRemaining <= 0,
  };
}

// Generate proof preview URL (stub)
export function generateProofPreview(proof: Proof): string {
  // In a real implementation, this would generate a preview image
  // from the artwork and specifications
  return `/api/proofs/${proof.id}/preview?version=${proof.version}`;
}

// Proof validation
export function validateProofArtwork(artworkUrl: string, specifications: {
  width: number;
  height: number;
  material: string;
}): {
  isValid: boolean;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  // Stub validation - in real implementation, would analyze image
  // For now, just return mock validation results
  
  // Check image dimensions (would be implemented with image analysis)
  if (specifications.width < 12) {
    warnings.push('Width is less than 12 inches - may affect print quality');
  }
  
  if (specifications.height < 12) {
    warnings.push('Height is less than 12 inches - may affect print quality');
  }
  
  // Check material compatibility (would be implemented with material specs)
  if (specifications.material === 'ACM-6MM' && specifications.width > 48) {
    warnings.push('Large size on thick material - verify mounting requirements');
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

// Proof workflow state machine
export function canTransitionTo(currentStatus: ProofStatus, newStatus: ProofStatus): boolean {
  const transitions: Record<ProofStatus, ProofStatus[]> = {
    [ProofStatus.PENDING]: [ProofStatus.SENT, ProofStatus.REJECTED],
    [ProofStatus.SENT]: [ProofStatus.APPROVED, ProofStatus.CHANGES_REQUESTED, ProofStatus.EXPIRED],
    [ProofStatus.APPROVED]: [], // Terminal state
    [ProofStatus.CHANGES_REQUESTED]: [ProofStatus.SENT, ProofStatus.REJECTED],
    [ProofStatus.REJECTED]: [], // Terminal state
    [ProofStatus.EXPIRED]: [ProofStatus.SENT], // Can resend after expiration
  };
  
  return transitions[currentStatus]?.includes(newStatus) || false;
}

// Proof reminders and escalations
export function getProofReminders(): Array<{
  proofId: string;
  type: 'reminder' | 'escalation';
  message: string;
  priority: 'low' | 'medium' | 'high';
}> {
  const reminders: Array<{
    proofId: string;
    type: 'reminder' | 'escalation';
    message: string;
    priority: 'low' | 'medium' | 'high';
  }> = [];
  
  const now = new Date();
  
  for (const proof of proofStore.values()) {
    if (proof.status !== ProofStatus.SENT) continue;
    
    const timeRemaining = getProofTimeRemaining(proof);
    
    // 6-hour reminder
    if (timeRemaining.totalMinutes <= 360 && timeRemaining.totalMinutes > 300) {
      reminders.push({
        proofId: proof.id,
        type: 'reminder',
        message: 'Proof reminder: 6 hours remaining',
        priority: 'medium',
      });
    }
    
    // 2-hour escalation
    if (timeRemaining.totalMinutes <= 120 && timeRemaining.totalMinutes > 60) {
      reminders.push({
        proofId: proof.id,
        type: 'escalation',
        message: 'Proof escalation: 2 hours remaining',
        priority: 'high',
      });
    }
    
    // Expired
    if (timeRemaining.isExpired) {
      reminders.push({
        proofId: proof.id,
        type: 'escalation',
        message: 'Proof expired - customer notification needed',
        priority: 'high',
      });
    }
  }
  
  return reminders;
}

// Proof statistics
export function getProofStats(): {
  total: number;
  pending: number;
  sent: number;
  approved: number;
  changesRequested: number;
  rejected: number;
  expired: number;
  averageResponseTime: number; // in minutes
} {
  const proofs = Array.from(proofStore.values());
  const total = proofs.length;
  
  const stats = {
    total,
    pending: 0,
    sent: 0,
    approved: 0,
    changesRequested: 0,
    rejected: 0,
    expired: 0,
    averageResponseTime: 0,
  };
  
  let totalResponseTime = 0;
  let responseCount = 0;
  
  for (const proof of proofs) {
    stats[proof.status]++;
    
    if (proof.status === ProofStatus.APPROVED && proof.sentAt && proof.approvedAt) {
      const responseTime = proof.approvedAt.getTime() - proof.sentAt.getTime();
      totalResponseTime += responseTime;
      responseCount++;
    }
  }
  
  if (responseCount > 0) {
    stats.averageResponseTime = Math.round(totalResponseTime / (responseCount * 1000 * 60)); // Convert to minutes
  }
  
  return stats;
}

// Utility functions
export function formatProofStatus(status: ProofStatus): string {
  const statusLabels: Record<ProofStatus, string> = {
    [ProofStatus.PENDING]: 'Pending',
    [ProofStatus.SENT]: 'Sent',
    [ProofStatus.APPROVED]: 'Approved',
    [ProofStatus.CHANGES_REQUESTED]: 'Changes Requested',
    [ProofStatus.REJECTED]: 'Rejected',
    [ProofStatus.EXPIRED]: 'Expired',
  };
  
  return statusLabels[status];
}

export function getProofStatusColor(status: ProofStatus): string {
  const colors: Record<ProofStatus, string> = {
    [ProofStatus.PENDING]: 'yellow',
    [ProofStatus.SENT]: 'blue',
    [ProofStatus.APPROVED]: 'green',
    [ProofStatus.CHANGES_REQUESTED]: 'orange',
    [ProofStatus.REJECTED]: 'red',
    [ProofStatus.EXPIRED]: 'gray',
  };
  
  return colors[status];
}

export function getProofStatusIcon(status: ProofStatus): string {
  const icons: Record<ProofStatus, string> = {
    [ProofStatus.PENDING]: '⏳',
    [ProofStatus.SENT]: '📤',
    [ProofStatus.APPROVED]: '✅',
    [ProofStatus.CHANGES_REQUESTED]: '🔄',
    [ProofStatus.REJECTED]: '❌',
    [ProofStatus.EXPIRED]: '⏰',
  };
  
  return icons[status];
}
