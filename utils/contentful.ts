export interface Person {
  name: string;
  class: number;
  roles: string[];
  image: string;
  link?: string;
}

export interface PageTextEntry {
  figmaId: string;
  shortText: string;
}

const teamMembersQuery = `{
  teamMembersCollection {
    items {
      name
      class
      roles
      photo {
        url
      }
      website
      github
      instagram
    }
  }
}`;

const getPageTextEntriesQuery = (pageName: string): string => `{
  pageCollection(where: {
    pageName: "${pageName}"
  }) {
    items {
      pageName
    	textEntriesCollection {
        items {
          figmaId
          shortText
        }
    	}
    }
  }
}`;

const executeCdaGqlQuery = async (query: string): Promise<Response> => {
  return await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE_ID}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({query}),
  });
};

export const fetchTeam = async (): Promise<any[] | undefined> => {
  const res = await executeCdaGqlQuery(teamMembersQuery);
  const {data} = await res.json();
  return data?.teamMembersCollection?.items ?? [];
};

export const fetchPageTextEntries = async (pageName: string): Promise<any[] | undefined> => {
  const res = await executeCdaGqlQuery(getPageTextEntriesQuery(pageName));
  const {data} = await res.json();
  let pageTextEntries = data?.pageCollection?.items ?? [];
  // Length of filtered pages should be one since page name is unique in contentful
  if (pageTextEntries.length !== 1) {
    return [];
  }
  pageTextEntries = pageTextEntries[0].textEntriesCollection?.items ?? [];
  return pageTextEntries ?? [];
};