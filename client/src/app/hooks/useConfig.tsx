import { useAppDispatch, useAppSelector } from 'app/store/configureStore'
import { fetchConfigPresetCompositionAsync } from 'features/admin/config/configSlice'
import { useEffect, useState } from 'react'

export function useConfig(multipleKeys: boolean) {
  const dispatch = useAppDispatch()
  const {configsLoaded} = useAppSelector(state => state.config)
  const configs = useAppSelector((state) => state.config)
  const configPresets = configs.configPresets

  useEffect(() => {
    if (!configsLoaded) dispatch(fetchConfigPresetCompositionAsync())
  }, [dispatch, configs, multipleKeys])
  return { configPresets, configsLoaded }
}
