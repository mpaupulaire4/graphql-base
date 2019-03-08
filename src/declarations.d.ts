declare module "bcrypt" {
  function hash(data: string, round: number): Promise<string>
  function compare(hash: string, compare: string): Promise<boolean>
}

declare module "graphql-iso-date" {
  const GraphQLDate: any;
  const GraphQLDateTime: any;
  const GraphQLTime: any;
}
