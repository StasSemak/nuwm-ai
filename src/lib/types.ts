type CategoryItem = {
  id: number;
  name: string;
};
type CategoriesResponse = BaseResponse & {
  data: CategoryItem[];
};

type FileItem = {
  id: number;
  name: string;
  createdAt: string;
  categories: CategoryItem[];
};
type FilesResponse = BaseResponse & {
  data: FileItem[];
};

type BaseResponse = {
  error: boolean;
  message: string;
};

type RequestItem = {
  id: number;
  contactNumber: string;
  chatId: string;
  createdAt: string;
  isResolved: boolean;
};

type HistoryItem = {
  id: number;
  chatId: string;
  role: string;
  content: string;
  createdAt: string;
  isAnswered: boolean;
};
type HistoryResponse = BaseResponse & {
  data: HistoryItem[];
};