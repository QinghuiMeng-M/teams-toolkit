// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/*
 * Basic API protocal of github issue
 */
export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Milestone {
  url: string;
  html_url: string;
  labels_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  description: string;
  creator: User;
  open_issues: number;
  closed_issues: number;
  state: string;
  created_at: string;
  updated_at: string;
  due_on: string | null;
  closed_at: string | null;
}

export interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string;
}

export interface Reactions {
  url: string;
  total_count: number;
  "+1": number;
  "-1": number;
  laugh: number;
  hooray: number;
  confused: number;
  heart: number;
  rocket: number;
  eyes: number;
}

export interface Issue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number | string;
  node_id: string;
  number: number;
  title: string;
  user: User;
  labels: Label[];
  state: string;
  locked: boolean;
  assignee: User;
  assignees: User[];
  milestone: Milestone;
  comments: number;
  fetchedComments: Comment[];
  created_at: string;
  updated_at: string;
  closed_at: null | string;
  author_association: string;
  active_lock_reason: null | string;
  body: string;
  reactions: Reactions;
  timeline_url: string;
  state_reason: null | string;
  score: number;
}

export interface Comment {
  id: number;
  node_id: string;
  user: User;
  created_at: string;
  updated_at: string;
  author_association: string;
  body: string;
  reactions: Reactions;
}

/*
 * index interface for Azure AI Search
 */
export interface IssueIndex extends Issue {
  BodyVector: number[];
  CommentVector: number[];
}

/*
 * Unified interface for github issue retrieving
 */
export interface GithubIssueRetriever<T> {
  retrieve(repo: string, query: string): Promise<T[]>;
  batchRetrieve(repo: string, queries: string[]): Promise<T[]>;
}

export interface GithubRetriever<T> {
  issue: GithubIssueRetriever<T>;
}
