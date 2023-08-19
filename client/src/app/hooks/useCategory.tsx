import agent from "app/api/agent"
import { useEffect, useState } from "react"
import { useCategories } from "./useCategories"
import { setProductParams } from "features/catalog/catalogSlice"
import { useAppDispatch } from "app/store/configureStore"
import { useParams } from "react-router-dom"

const categoryCache: { [key: number]: { title: string; pictureUrl: string; id: number } } = {};
let currentId = 0

export const useCategory = (categoryId?: number) => {
    const [category, setCategory] = useState<{title: string, pictureUrl: string, id: number}>({title: '', pictureUrl: '', id: 1})
    const [categoryLoading, setCategoryLoading] = useState(true)
    const {categories, categoriesLoading} = useCategories()
    const { id } = useParams<{ id: string }>()
    const dispatch = useAppDispatch()

    const fetchCategories = async () => {
      if(id !== undefined || categoryId !== undefined){
        const newId = categoryId !== undefined ? categoryId : parseInt(id!)
        const abc = categoryId !== undefined ? categoryId !== currentId : newId !== currentId
        currentId = newId
      if (categoryCache[newId] && !abc) {
        setCategory(categoryCache[newId]);
        setCategoryLoading(false);
      } else {
        const cat = categories.find((c: { id: number }) => c.id === newId);
        if (cat) {
          categoryCache[newId] = cat;
          setCategory(cat);
        }
        if(newId === 0) {categoryCache[newId] = {title: '', pictureUrl: '', id: 0}; setCategory({title: '', pictureUrl: '', id: 0})}
        dispatch(setProductParams({ categoryId: newId }));
        setCategoryLoading(false);
      }}
    };
  useEffect(() => {
    if(categoryId !== undefined && !categoriesLoading) fetchCategories()
    if(categoriesLoading || id === undefined) return
    fetchCategories()
  }, [id, categoriesLoading])
  return {category, categoryLoading}
}