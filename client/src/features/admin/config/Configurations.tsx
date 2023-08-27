import React, { useEffect, useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import agent from '../../../app/api/agent'
import { Configurable } from '../../../app/models/product'
import ConfigDialog, { IConfigPresetComposition } from './ConfigPreset/ConfigDialog'
import { createNewConfig } from '../../../app/util/util'
import Config from './Config'
import { LoadingButton } from '@mui/lab'
import { FieldValues, useForm } from 'react-hook-form'
import _ from 'lodash'
import { toast } from 'react-toastify'

interface Props {
  productId: number
  configs?: Configurable[]
}

const Configurations = ({ productId, configs }: Props) => {
  const [configurations, setConfigurations] = useState<Configurable[]>(configs?.map((cfg, id) => {return {...cfg, tempId: id}}) || [])
  const [configAdded, setConfigAdded] = useState(false)
  const [configPresets, setConfigPresets] = useState<IConfigPresetComposition[]>([])
  const [defaultKey, setDefaultKey] = useState((configs && configs[0]?.key) || '')
  const [radioButton, setRadioButton] = useState((configs && configs[0]?.id) || 0)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty, isSubmitting, isValid },
  } = useForm({})

  const isUnChanged = (a: Configurable, b: Configurable) => {
    const aCopy = {
      value: a.value.toString(),
      price: a.price.toString(),
      quantityInStock: a.quantityInStock.toString(),
    }
    const bCopy = {
      value: b.value.toString(),
      price: b.price.toString(),
      quantityInStock: b.quantityInStock.toString(),
    }
    return b['file'] === null && _.isEqual(aCopy, bCopy)
  }

  async function handleSubmitData(data: FieldValues) {
    const dataArray: Configurable[] = Object.values(data)

    const promises = dataArray.map(async (config) => {
      try {
        // Check if the config has changed before updating it
        const oldConfig = configurations.find((c) => c.id?.toString() === config.id?.toString())

        if (!oldConfig || !isUnChanged(oldConfig, config)) {
          const res = config.id
            ? await agent.Admin.updateConfig(config).then((res) =>
                setConfigurations(configurations.map((cfg) => (cfg.id === res.id ? res : cfg))),
              )
            : await agent.Admin.createConfig(config)
          return res
        } else {
          return null
        }
      } catch (error) {
        console.log(error)
      }
    })

    await Promise.all(promises)
    addPresetsToProduct()
  }

  const addPresetsToProduct = () => {
    if (configPresets) {
      configPresets.forEach(({ configurations }) =>
        configurations.forEach(
          async (configuration) => await agent.Admin.addConfigPreset(configuration, productId),
        ),
      )
    }
  }

  const handleCloseModal = (
    configKey: string,
    configPresets?: IConfigPresetComposition[],
    combinations?: string[],
  ) => {
    setConfigAdded(true)

    const newConfigs = combinations?.map((combination, index) =>
      createNewConfig(configKey, productId, combination, index),
    )
    setConfigurations(newConfigs || [])
    setDefaultKey(configKey)
    setConfigPresets(configPresets || [])
  }

  useEffect(() => {
    if (configs?.length! > 0) {
      setConfigAdded(true)
    }
  }, [configs])

  if (!configAdded && (!configs || configs.length === 0)) {
    return (
      <ConfigDialog
        handleConfigSubmit={(configKey, configPresets, values) =>
          handleCloseModal(configKey, configPresets, values)
        }
      />
    )
  }

  const removeConfig = async (config: Configurable) => {
    if (config.id) {
      configurations[0].key.split(',').length > 1
        ? toast.error('Not yet possible')
        : await agent.Admin.removeConfig(config.id).then((res) =>
            toast.warning('Config removed, update not yet implemented'),
          )
      return
    }
    const newConfigurations = configurations.filter((cfg) => cfg.tempId !== config.tempId)
    setConfigurations(newConfigurations)
  }

  const setDefaultConfig = async () => {
    const config = configurations.find(cfg => cfg.id === configurations[radioButton].id)
    console.log(config)
    if(!config) {
      toast.warning("not possible")
    }
    else {await agent.Admin.setDefaultProduct({
      id: config.productId,
      quantityInStock: config.quantityInStock,
      price: config.price,
      pictureUrl: config.images[0].pictureUrl,
    })  
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitData)}>
      <Box component={Paper} variant='outlined' sx={{ p: 4 }}>
        <Typography variant='h4' gutterBottom sx={{ mb: 4 }}>
          Product Configurations
        </Typography>
      </Box>
      {configurations.map((config, index) => {
        return (
          <Box key={config.tempId}>
            <Config
              config={config}
              removeConfig={removeConfig}
              control={control}
              setValue={setValue}
              watch={watch}
              index={index}
              radioNumber={radioButton}
              setRadioNumber={(i: number) => setRadioButton(i)}
            />
          </Box>
        )
      })}
      <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
        <Button
          onClick={() =>
            setConfigurations([...configurations, createNewConfig(defaultKey, productId, '', configurations.length)])
          }
          variant='contained'
          color='inherit'
        >
          {configurations[0].key.split(',').length > 1
            ? 'Modify configurations'
            : 'Add Configuration'}
        </Button>
        <Button
          onClick={setDefaultConfig}
        >
          Set default config
        </Button>
        <LoadingButton
          type='submit'
          variant='contained'
          color='success'
          disabled={!isDirty || !isValid}
          loading={isSubmitting}
        >
          Save
        </LoadingButton>
      </Box>
    </form>
  )
}

export default Configurations
