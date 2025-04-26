export interface Citation {
  index: number;
  text: string;
  start?: number;
  end?: number;
  type?: string;
  sources: Array<{
    metadata?: {
      page_number?: number;
      title?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }>;
  document: string;
  page?: string | null;
}
