import { useAppDispatch, useAppSelector } from 'app/store/configureStore'
import { fetchConfigPresetCompositionAsync } from 'features/admin/config/configSlice'
import { useEffect, useState } from 'react'

export function useConfig(multipleKeys: boolean) {
  const dispatch = useAppDispatch()
  const configs = useAppSelector((state) => state.config)
  const configPresets = configs.configPresets
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!multipleKeys) return
    if (!configPresets) dispatch(fetchConfigPresetCompositionAsync()).then(() => setLoading(false))
  }, [dispatch, configs, multipleKeys])
  return { configPresets, loading }
}
