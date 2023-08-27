import { Box } from '@mui/material'
import RadioButtonGroup from 'app/components/RadioButtonGroup'
import Render from 'app/layout/Render'
import { IProduct } from 'app/models/product'
import { useState } from 'react'

interface Props {
  onConfigChange: (btns: any) => void
  product: IProduct
  defaultConfig: IRadioButton
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

export function ProductConfigs({ onConfigChange, product, defaultConfig }: Props) {
  const [checkedRadioButton, setCheckedRadioButton] = useState<IRadioButton[]>([
    defaultConfig,
  ])
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
  return (
    <Render condition={radioButtons.length > 0}>
      <>
        {radioButtons.map((cfg) => {
          return (
            <Box key={cfg.key}>
              <Box marginTop={1}>Choose {cfg.key}:</Box>
              <RadioButtonGroup
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
      </>
    </Render>
  )
}
