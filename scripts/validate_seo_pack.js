const fs = require('fs');
const path = require('path');

// SEO Pack validation rules
const VALIDATION_RULES = {
  title_tag: { min: 30, max: 60 },
  meta_description: { min: 140, max: 160 },
  h1: { min: 10, max: 100 },
  intro_paragraph: { min: 100, max: 300 },
  feature_bullets: { min: 3, max: 6 },
  target_keywords: { min: 3, max: 8 }
};

function validateSeoPack(filePath) {
  const errors = [];
  const warnings = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const pack = JSON.parse(content);
    
    // Required fields
    const requiredFields = [
      'slug', 'page_type', 'title_tag', 'meta_description', 
      'h1', 'intro_paragraph', 'feature_bullets', 'cta_blurb',
      'schema', 'internal_links', 'target_keywords', 'audience_segment'
    ];
    
    for (const field of requiredFields) {
      if (!pack[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    // Length validations
    if (pack.title_tag) {
      if (pack.title_tag.length < VALIDATION_RULES.title_tag.min) {
        warnings.push(`Title tag too short (${pack.title_tag.length} chars, min ${VALIDATION_RULES.title_tag.min})`);
      }
      if (pack.title_tag.length > VALIDATION_RULES.title_tag.max) {
        errors.push(`Title tag too long (${pack.title_tag.length} chars, max ${VALIDATION_RULES.title_tag.max})`);
      }
    }
    
    if (pack.meta_description) {
      if (pack.meta_description.length < VALIDATION_RULES.meta_description.min) {
        warnings.push(`Meta description too short (${pack.meta_description.length} chars, min ${VALIDATION_RULES.meta_description.min})`);
      }
      if (pack.meta_description.length > VALIDATION_RULES.meta_description.max) {
        errors.push(`Meta description too long (${pack.meta_description.length} chars, max ${VALIDATION_RULES.meta_description.max})`);
      }
    }
    
    if (pack.feature_bullets && Array.isArray(pack.feature_bullets)) {
      if (pack.feature_bullets.length < VALIDATION_RULES.feature_bullets.min) {
        warnings.push(`Too few feature bullets (${pack.feature_bullets.length}, min ${VALIDATION_RULES.feature_bullets.min})`);
      }
      if (pack.feature_bullets.length > VALIDATION_RULES.feature_bullets.max) {
        warnings.push(`Too many feature bullets (${pack.feature_bullets.length}, max ${VALIDATION_RULES.feature_bullets.max})`);
      }
    }
    
    // Schema validation
    if (pack.schema) {
      if (!pack.schema.type) {
        errors.push('Schema missing type');
      }
      if (!pack.schema.brand) {
        errors.push('Schema missing brand');
      }
    }
    
    return { errors, warnings, valid: errors.length === 0 };
    
  } catch (error) {
    return {
      errors: [`JSON parse error: ${error.message}`],
      warnings: [],
      valid: false
    };
  }
}

// Main validation function
function validateAllSeoPacks() {
  const seoPacksDir = path.join(__dirname, '..', 'content', 'seo_packs');
  
  if (!fs.existsSync(seoPacksDir)) {
    console.log('❌ SEO packs directory not found');
    return;
  }
  
  const files = fs.readdirSync(seoPacksDir).filter(file => file.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('❌ No SEO pack files found');
    return;
  }
  
  console.log(`🔍 Validating ${files.length} SEO pack files...\n`);
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  files.forEach(file => {
    const filePath = path.join(seoPacksDir, file);
    const result = validateSeoPack(filePath);
    
    console.log(`📄 ${file}`);
    
    if (result.valid) {
      console.log('✅ Valid');
    } else {
      console.log('❌ Invalid');
    }
    
    if (result.errors.length > 0) {
      result.errors.forEach(error => {
        console.log(`  ❌ ${error}`);
        totalErrors++;
      });
    }
    
    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => {
        console.log(`  ⚠️  ${warning}`);
        totalWarnings++;
      });
    }
    
    console.log('');
  });
  
  console.log(`📊 Summary:`);
  console.log(`  Total files: ${files.length}`);
  console.log(`  Errors: ${totalErrors}`);
  console.log(`  Warnings: ${totalWarnings}`);
  
  if (totalErrors === 0) {
    console.log('🎉 All SEO packs are valid!');
  } else {
    console.log('❌ Some SEO packs have errors that need to be fixed.');
    process.exit(1);
  }
}

// Run validation if called directly
if (require.main === module) {
  validateAllSeoPacks();
}

module.exports = { validateSeoPack, validateAllSeoPacks };
