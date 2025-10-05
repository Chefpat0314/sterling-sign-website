import { GetStaticPaths, GetStaticProps } from 'next';
import { getServiceBySlug, getAllServices, Service } from '../../data/services';
import InfoDetailLayout from '../../components/InfoDetailLayout';

interface ServicePageProps {
  service: Service;
}

export default function ServicePage({ service }: ServicePageProps) {
  return (
    <InfoDetailLayout
      slug={service.slug}
      name={service.name}
      headline={service.headline}
      subhead={service.subhead}
      bullets={service.bullets}
      heroImage={service.heroImage}
      alt={service.alt}
      ctaLabel={service.ctaLabel}
      ctaHref={service.ctaHref}
      type="services"
    />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const services = getAllServices();
  const paths = services.map((service) => ({
    params: { slug: service.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      service,
    },
  };
};