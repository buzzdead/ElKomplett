import agent from "app/api/agent"
import { useEffect, useState } from "react"

export const useCategories = () => {
    const [categories, setCategories] = useState<{title: string, pictureUrl: string, id: number}[]>([{title: '', pictureUrl: '', id: 1}])
    const [categoriesLoading, setCategoriesLoading] = useState(true)

  const fetchCategories = async () => {
    const cats = await agent.Catalog.categories()
    setCategories(cats)
    setCategoriesLoading(false)
  }
  useEffect(() => {
    if(categories.length === 1)
    fetchCategories()
  }, [])
  return {categories, categoriesLoading}
}