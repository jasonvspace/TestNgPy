export type Project = {
  id: number;
  title: string;
  description: string;
  active: boolean;
};

export type Todo = {
  id: number;
  project: number;
  title: string;
  description: string;
  active: boolean;
}