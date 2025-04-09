import { strapiClient } from "./strapi-client";

const blocksPopulate = {
  on: {
    "blocks.hero": {
      populate: {
        image: {
          fields: ["url", "alternativeText"],
        },
        links: true,
      },
    },
    "blocks.heading-section": true,
    "blocks.card-grid": {
      populate: {
        card: true,
      },
    },
    "blocks.content-with-image": {
      populate: {
        image: {
          fields: ["url", "alternativeText"],
        },
        link: true,
      },
    },
    "blocks.faqs": {
      populate: {
        faq: true,
      },
    },
    "blocks.person-card": {
      populate: {
        image: {
          fields: ["url", "alternativeText"],
        },
      },
    },
    "blocks.markdown": true,
    "blocks.featured-articles": {
      populate: {
        articles: {
          populate: {
            featuredImage: {
              fields: ["url", "alternativeText"],
            },
            author: {
              populate: {
                image: {
                  fields: ["url", "alternativeText"],
                },
              },
            },
            contentTags: {
              fields: ["title", "description"], 
            },
          },
        },
      },
    },
    "blocks.newsletter": true,
    "blocks.layout-image": {
      populate: {
        image: {
          fields: ["url", "alternativeText"],
        },
      },
    },
  },
};

async function getCollectionType(name: string, params: object) {
  const data = await strapiClient.collection(name).find(params);
  return data;
}

async function getSingleType(name: string, params: object) {
  const data = await strapiClient.single(name).find(params);
  return data;
}

async function getGlobalPageData() {
  const data = await getSingleType("global", {
    populate: {
      banner: {
        populate: {
          link: {
            fields: ["href", "label", "isExternal"],
          },
        },
      },
      header: {
        populate: {
          logo: {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
          navItems: true,
          cta: true,
        },
      },
      footer: {
        populate: {
          logo: {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
          navItems: true,
          socialLinks: {
            populate: {
              image: {
                fields: ["url", "alternativeText"],
              },
            },
          },
        },
      }
    },
  });
  const globalData = data?.data;
  if (!globalData) throw new Error("No global data found");
  return globalData;
}

async function getLandingPageData() {
  const data = await getSingleType("landing-page", {
    populate: {
      blocks: blocksPopulate,
    },
  });
  return data;
}

async function getAllPages(page: number) {
  const data = await getCollectionType("pages", {
    populate: {
      blocks: blocksPopulate,
    },
    pagination: {
      page,
      pageSize: 25,
    },
  });
  if (!data?.data) throw new Error("No data found");
  const totalPages = data?.meta?.pagination?.pageCount;
  const currentPage = data?.meta?.pagination?.page;
  const hasMore = currentPage && totalPages && currentPage < totalPages;
  return { data: data.data, hasMore };
}

async function getAllArticles(page: number) {
  const data = await getCollectionType("articles", {
    populate: {
      featuredImage: {
        fields: ["url", "alternativeText"],
      },
      author: {
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      contentTags: true,
      blocks: blocksPopulate,
    },
    pagination: {
      page,
      pageSize: 25,
    },
  });
  if (!data?.data) throw new Error("No data found");
  const totalPages = data?.meta?.pagination?.pageCount;
  const currentPage = data?.meta?.pagination?.page;
  const hasMore = currentPage && totalPages && currentPage < totalPages;
  return { data: data.data, hasMore };
}

export { getGlobalPageData, getLandingPageData, getAllPages, getAllArticles };
