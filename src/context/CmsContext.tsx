import { createContext, useContext, useState, ReactNode } from "react";
import {
  CMSPost, CMSBanner, CMSPage,
  INITIAL_POSTS, INITIAL_BANNERS, INITIAL_PAGES,
} from "@/data/cmsMock";

interface CmsContextValue {
  posts: CMSPost[];
  banners: CMSBanner[];
  pages: CMSPage[];
  // Posts
  savePost: (p: CMSPost) => void;
  deletePost: (id: string) => void;
  // Banners
  saveBanner: (b: CMSBanner) => void;
  deleteBanner: (id: string) => void;
  toggleBanner: (id: string) => void;
  // Pages
  savePage: (p: CMSPage) => void;
  deletePage: (id: string) => void;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export const CmsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<CMSPost[]>(INITIAL_POSTS);
  const [banners, setBanners] = useState<CMSBanner[]>(INITIAL_BANNERS);
  const [pages, setPages] = useState<CMSPage[]>(INITIAL_PAGES);

  const savePost = (p: CMSPost) =>
    setPosts((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev];
    });
  const deletePost = (id: string) => setPosts((prev) => prev.filter((p) => p.id !== id));

  const saveBanner = (b: CMSBanner) =>
    setBanners((prev) => {
      const exists = prev.some((x) => x.id === b.id);
      return exists ? prev.map((x) => (x.id === b.id ? b : x)) : [b, ...prev];
    });
  const deleteBanner = (id: string) => setBanners((prev) => prev.filter((b) => b.id !== id));
  const toggleBanner = (id: string) =>
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, aktif: !b.aktif } : b)));

  const savePage = (p: CMSPage) =>
    setPages((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev];
    });
  const deletePage = (id: string) => setPages((prev) => prev.filter((p) => p.id !== id));

  return (
    <CmsContext.Provider
      value={{
        posts, banners, pages,
        savePost, deletePost,
        saveBanner, deleteBanner, toggleBanner,
        savePage, deletePage,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be inside CmsProvider");
  return ctx;
};
