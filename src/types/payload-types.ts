/* tslint:disable */

/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    items: Item;
    categories: Category;
    pages: Page;
    media: Media;
    users: User;
    redirects: Redirect;
    'rewards-program': RewardsProgram;
    referral: Referral;
    points: Points;
    'deploy-collection': DeployCollection;
    mints: Mint;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {
    settings: Settings;
    header: Header;
    core: Core;
  };
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "items".
 */
export interface Item {
  id: string;
  title: string;
  category: string | Category;
  barcode?: string | null;
  uniqueLink?: string | null;
  isTargetAR?: boolean | null;
  marker_3d?: {
    url?: string | null;
  } | null;
  publicUniqueLink?: boolean | null;
  batchCreation?: boolean | null;
  batchCreationCount?: number | null;
  /**
   * @minItems 2
   * @maxItems 2
   */
  location: [number, number];
  image?: string | Media | null;
  desc?: {
    slate?:
      | {
          [k: string]: unknown;
        }[]
      | null;
    html?: string | null;
  };
  claimedBy?: (string | null) | User;
  claimedAt?: string | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories".
 */
export interface Category {
  id: string;
  slug?: string | null;
  title: string;
  shortTitle?: string | null;
  rewardProgram?: (string | null) | RewardsProgram;
  deployedCollection?: (string | null) | DeployCollection;
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "rewards-program".
 */
export interface RewardsProgram {
  id: string;
  title: string;
  details: {
    pointsPerClaim: number;
  };
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "deploy-collection".
 */
export interface DeployCollection {
  id: string;
  title: string;
  details: {
    name: string;
    symbol: string;
    collectionAddress?: string | null;
  };
  settings: {
    maxMintPerUser: number;
  };
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  alt: string;
  base64?: string | null;
  caption?: {
    slate?:
      | {
          [k: string]: unknown;
        }[]
      | null;
    html?: string | null;
  };
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    medium?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    large?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  name?: string | null;
  roles?: ('admin' | 'user')[] | null;
  createdAt: string;
  updatedAt: string;
  referralCode?: string | null;
  sub?: string | null;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pages".
 */
export interface Page {
  id: string;
  slug?: string | null;
  title: string;
  publishedDate?: string | null;
  layout?:
    | (
        | {
            sectionID?: string | null;
            title?: {
              slate?:
                | {
                    [k: string]: unknown;
                  }[]
                | null;
              html?: string | null;
            };
            image?: string | Media | null;
            imagePosition?: ('left' | 'right') | null;
            desc?: {
              slate?:
                | {
                    [k: string]: unknown;
                  }[]
                | null;
              html?: string | null;
            };
            links?:
              | {
                  link: {
                    type?: ('reference' | 'archive' | 'custom') | null;
                    newTab?: boolean | null;
                    reference?: {
                      relationTo: 'pages';
                      value: string | Page;
                    } | null;
                    archive?: string | null;
                    url?: string | null;
                    label: string;
                    displayIcon?: boolean | null;
                    icon?: string | null;
                    iconPosition?: ('left' | 'right') | null;
                  };
                  id?: string | null;
                }[]
              | null;
            displaySocialMedia?: boolean | null;
            cardVariant?: ('default' | 'primary' | 'secondary') | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'intro-content';
          }
        | {
            sectionID?: string | null;
            title?: {
              slate?:
                | {
                    [k: string]: unknown;
                  }[]
                | null;
              html?: string | null;
            };
            id?: string | null;
            blockName?: string | null;
            blockType: 'map-items';
          }
        | {
            sectionID?: string | null;
            title?: {
              slate?:
                | {
                    [k: string]: unknown;
                  }[]
                | null;
              html?: string | null;
            };
            description?: {
              slate?:
                | {
                    [k: string]: unknown;
                  }[]
                | null;
              html?: string | null;
            };
            cardsList?:
              | {
                  title: string;
                  description: string;
                  cardVariant?: ('default' | 'primary' | 'secondary') | null;
                  id?: string | null;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'cards';
          }
        | {
            sectionID?: string | null;
            title?: {
              slate?:
                | {
                    [k: string]: unknown;
                  }[]
                | null;
              html?: string | null;
            };
            description?: {
              slate?:
                | {
                    [k: string]: unknown;
                  }[]
                | null;
              html?: string | null;
            };
            image?: string | Media | null;
            imageMobile?: string | Media | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'roadmap';
          }
        | {
            sectionID?: string | null;
            rewardsProgram?: (string | null) | RewardsProgram;
            cardVariant?: ('default' | 'primary' | 'secondary') | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'leaderboard';
          }
      )[]
    | null;
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: string | Media | null;
  };
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "redirects".
 */
export interface Redirect {
  id: string;
  from: string;
  to?: {
    type?: ('reference' | 'custom') | null;
    reference?: {
      relationTo: 'pages';
      value: string | Page;
    } | null;
    url?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "referral".
 */
export interface Referral {
  id: string;
  user?: (string | null) | User;
  referralCode?: string | null;
  invitationReferralCode?: (string | null) | Referral;
  points?: number | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "points".
 */
export interface Points {
  id: string;
  user?: (string | null) | User;
  rewardsProgram?: (string | null) | RewardsProgram;
  rewardsPointsEarned?: number | null;
  claims?:
    | {
        claimable?: (string | null) | Item;
        rewardsPointsEarned?: number | null;
        id?: string | null;
      }[]
    | null;
  referrals?:
    | {
        referral?: (string | null) | User;
        rewardsPointsEarned?: number | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "mints".
 */
export interface Mint {
  id: string;
  claimable?: (string | null) | Item;
  user?: (string | null) | User;
  category?: (string | null) | Category;
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "settings".
 */
export interface Settings {
  id: string;
  homePage?: (string | null) | Page;
  socialLinks?: {
    instagram?: string | null;
    tiktok?: string | null;
    twitter?: string | null;
    youtube?: string | null;
    telegram?: string | null;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "header".
 */
export interface Header {
  id: string;
  logo: {
    title: string;
    image?: string | Media | null;
  };
  menu: {
    links?:
      | {
          link: {
            type?: ('reference' | 'archive' | 'custom') | null;
            newTab?: boolean | null;
            reference?: {
              relationTo: 'pages';
              value: string | Page;
            } | null;
            archive?: string | null;
            url?: string | null;
            label: string;
            displayIcon?: boolean | null;
            icon?: string | null;
            iconPosition?: ('left' | 'right') | null;
          };
          id?: string | null;
        }[]
      | null;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "core".
 */
export interface Core {
  id: string;
  pointsPerReferral: number;
  pointsPerReferralInvited: number;
  rewardsProgram?: (string | RewardsProgram)[] | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
