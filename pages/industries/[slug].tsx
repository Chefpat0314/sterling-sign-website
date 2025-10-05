import { GetStaticPaths, GetStaticProps } from 'next';
import { getIndustryBySlug, getAllIndustries, Industry } from '../../data/industries';
import InfoDetailLayout from '../../components/InfoDetailLayout';

interface IndustryPageProps {
  industry: Industry;
}

export default function IndustryPage({ industry }: IndustryPageProps) {
  return (
    <InfoDetailLayout
      slug={industry.slug}
      name={industry.name}
      headline={industry.headline}
      subhead={industry.subhead}
      bullets={industry.bullets}
      heroImage={industry.heroImage}
      alt={industry.alt}
      ctaLabel={industry.ctaLabel}
      ctaHref={industry.ctaHref}
      type="industries"
    />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const industries = getAllIndustries();
  const paths = industries.map((industry) => ({
    params: { slug: industry.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const industry = getIndustryBySlug(slug);

  if (!industry) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      industry,
    },
  };
};