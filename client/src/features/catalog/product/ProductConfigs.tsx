import { Box, Typography } from '@mui/material'
import RadioButtonGroup from 'app/components/RadioButtonGroup'
import SelectButtonGroup from 'app/components/SelectButtonGroup'
import { Config, ConfigsState } from 'app/hooks/useConfigs'
import useView from 'app/hooks/useView'
import Render from 'app/layout/Render'
import { Basket } from 'app/models/basket'
import { IProduct } from 'app/models/product'
import { useState } from 'react'

interface Props {
  product: IProduct
  config: Config | null
  basket: Basket | null
  updateState: (state: ConfigsState) => void
  modal?: boolean
}

interface ConfigMap {
  key: string
  values: string[]
}

type radioButton = IProduct['configPresets'] | IProduct['configurables']

export interface IRadioButton {
  key: string
  checkedValue: string
}

export function ProductConfigs({  product, config, basket, updateState, modal=false }: Props) {
  const [checkedRadioButton, setCheckedRadioButton] = useState<IRadioButton[]>([
    config && config.config
                  ? { key: config.config.key, checkedValue: config?.value }
                  : { key: '', checkedValue: '' },
  ])
  const view = useView()
  function onRadioButtonChange(value: string, key: string = '') {
    const currentRadioButtons = checkedRadioButton.map((checked) =>
      checked.key === key ? { key: key, checkedValue: value } : checked,
    )
    !currentRadioButtons.find((e) => e.key === key) &&
      currentRadioButtons.push({ key: key, checkedValue: value })

    onConfigChange(currentRadioButtons)
    setCheckedRadioButton(currentRadioButtons)
  }

  const radioButtonsMap = (buttons: radioButton): ConfigMap[] => {
    if (!buttons) return []
    const configMap: ConfigMap[] = []
    buttons.forEach((cfg) => {
      const key = configMap.find((e) => e.key === cfg.key)
      key ? key.values.push(cfg.value) : configMap.push({ key: cfg.key, values: [cfg.value] })
    })
    return configMap
  }
  const radioButtons = radioButtonsMap(
    product.configPresets && product.configPresets?.length > 0
      ? product.configPresets
      : product.configurables,
  )

  const isTheRightOne = (a: string, b: string) => {
    
    const arrayA = a.split(' ')
    const arrayB = b.split(' ')


    if (arrayA.length !== arrayB.length) {
      return false
    }

    const sortedArrayA = arrayA.sort()
    const sortedArrayB = arrayB.sort()

    return sortedArrayA.every((value, index) => value === sortedArrayB[index])
  }

  function onConfigChange(updatedWithNewValue: IRadioButton[]) {
    const newConfig = updatedWithNewValue.filter((e, id) => product.configPresets && product.configPresets.length > 0 ? id > 0 && e.checkedValue !== '' : e.checkedValue !== '')
    const newConfigValue = newConfig.map((e) => e.checkedValue).join(' ')
    console.log(newConfigValue)
    const currentConfig = product?.configurables?.find((e) =>
      isTheRightOne(e.value, newConfigValue),
    )
    const basketItems = basket?.items.filter(
      (i: { productId: number | undefined }) => i.productId === product?.id,
    )
    const bItem = basketItems?.find((e) => e.configId === currentConfig?.id)
    currentConfig && updateState({basketItem: bItem, newQuantity: bItem?.quantity || 0, currentPicture: currentConfig?.images[0], config:  { config: currentConfig, value: currentConfig.value, id: currentConfig.id }})

  }
  return (
    <Render condition={radioButtons.length > 0}>
      <Box sx={{display: 'flex', flexDirection: 'row',}}>
        {radioButtons.map((cfg, id) => {
          return (
            <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, mt: modal ? 0 : 2, mb: modal ? 2 : 0}} key={cfg.key}>
              {id === 0 && <Typography fontSize={20} variant='h4' sx={{display: 'flex', alignSelf: 'center', marginLeft: 1}}>Select: </Typography>}
              <SelectButtonGroup
                label={cfg.key}
                flexDirection='row'
                selectedValue={
                  checkedRadioButton.find((b) => b.key === cfg.key)?.checkedValue || ''
                }
                options={cfg.values.map((e) => ({ value: e, label: e }))}
                onChange={(e) => onRadioButtonChange(e.target.value, cfg.key)}
              />
            </Box>
          )
        })}
      </Box>
    </Render>
  )
}
