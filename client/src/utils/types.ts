export interface Image {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string;
}

export interface ImageFormat {
  url: string;
  width?: number;
  height?: number;
}

export interface ImageLayout {
  formats?: {
    large?: ImageFormat;
  };
  url: string;
 }

 export interface ImageData {
  id: number;
  documentId?: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  url: string;
  formats?: {
    thumbnail?: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
    small?: {
      url: string;
      width: number;
      height: number;
      size: number;
    };
  };
}

export interface CardImageItem {
  id: number;
  title: string;
  url: string;
  description: string;
  image: ImageData;
}
export interface Logo {
  id: number;
  logoText: string;
  logoLink: string;
  image: Image;
}

export interface Link {
  href: string;
  label?: string;
  isExternal?: boolean;
  isButtonLink?: boolean;
  type?: "PRIMARY" | "SECONDARY";
  isMenuDropdown?: boolean;
  dropdownItems: { data: Link[] };
}

export interface GlobalPageHeader {
  logo: Logo;
  navItems: Link[];
  cta: Link;
}

export interface GlobalPageFooter {
  logo: Logo;
  navItems: Link[];
  socialLinks: Logo[];
  text: string;
}

export type ComponentType =
  | "blocks.hero"
  | "blocks.heading-section"
  | "blocks.card-grid"
  | "blocks.content-with-image"
  | "blocks.faqs"
  | "blocks.person-card"
  | "blocks.markdown"
  | "blocks.featured-articles"
  | "blocks.newsletter"
  | "blocks.layout-image"
  | "blocks.layout-card";

export interface Base<
  T extends ComponentType,
  D extends object = Record<string, unknown>
> {
  id?: number;
  __component: T;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  data?: D;
}

export interface HeroProps extends Base<"blocks.hero"> {
  heading: string;
  text: string;
  image: Image;
  links: Link[];
}

export interface HeadingSectionProps extends Base<"blocks.heading-section"> {
  subHeading: string;
  heading: string;
  anchorLink: string;
}

export interface CardGridProps extends Base<"blocks.card-grid"> {
  card: {
    id: number;
    heading: string;
    text: string;
    image: Image;
  }[];
}

export interface ContentWithImageProps
  extends Base<"blocks.content-with-image"> {
  heading: string;
  text: string;
  link: Link;
  image: Image;
  reversed: boolean;
}

export interface FaqsProps extends Base<"blocks.faqs"> {
  faq: {
    heading: string;
    text: string;
  }[];
}
export interface PersonCardProps extends Base<"blocks.person-card"> {
  personName: string;
  personJob: string;
  image: Image;
  text: string;
}

export interface MarkdownProps extends Base<"blocks.markdown"> {
  content: string;
}

export interface FeaturedArticlesProps extends Base<"blocks.featured-articles"> {
  titleFeature: string | null;
  articles: {
    id: number;
    documentId: string;
    title: string;
    description: string;
    link: Link;
    publishedAt: string;
    updatedAt: string;
    slug: string;
    author: {
      id: number;
      documentId: string;
      fullName: string;
      image: Image;
    };
    featuredImage: Image;
    contentTags: {
      id: number;
      title: string;
      description: string;
    }[];
  }[];
}

export interface NewsletterProps extends Base<"blocks.newsletter"> {
  heading: string;
  text: string;
  placeholder: string;
  label: string;
  formId: string;
}

export interface LayoutImageProps extends Base<"blocks.layout-image"> {
  id: number;
  label: string;
  href: string;
  image: ImageLayout[];
}

export interface LayoutCardProps extends Base<"blocks.layout-card"> {
  id: number;
  titleSection: string | null;
  cardImage: CardImageItem[];
}

export type BlockData =
  | HeroProps
  | HeadingSectionProps
  | CardGridProps
  | ContentWithImageProps
  | FaqsProps
  | PersonCardProps
  | MarkdownProps
  | FeaturedArticlesProps
  | NewsletterProps
  | LayoutImageProps
  | LayoutCardProps;
