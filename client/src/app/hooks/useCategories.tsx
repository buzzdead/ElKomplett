import agent from "app/api/agent"
import { useEffect, useState } from "react"

export type Category = { title: string, pictureUrl: string, id: number, description: string }

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([{title: '', pictureUrl: '', id: 1, description: ''}])
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