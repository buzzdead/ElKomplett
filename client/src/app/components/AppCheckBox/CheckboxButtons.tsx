import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'

interface Props {
    items: string[]
    checked?: string[]
    flexRow?: boolean
    onChange: (items: string[]) => void
}

export default function CheckboxButtons({items, checked, onChange, flexRow = false}: Props) {
    const [checkedItems, setCheckedItems] = useState(checked || [])
    const timer = useRef<NodeJS.Timeout>()

    const debouncedOnChange = () => {
        if(timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => {onChange(checkedItems)}, 600)
    }

    useUpdateEffect(() => {
        debouncedOnChange()
    }, [checkedItems])
    function handleChecked(value: string) {
        const currentIndex = checkedItems.findIndex(item => item === value)
        let newChecked: string[] = []
        if(currentIndex === -1) newChecked = [...checkedItems, value]
        else newChecked = checkedItems.filter(item => item !== value)
        setCheckedItems(newChecked)
    }
    return (
        <FormGroup sx={{display: 'flex', flexDirection: flexRow ? 'row' : 'column' }}>
            {items.map(item => (
              <FormControlLabel control={<Checkbox checked={checkedItems.indexOf(item) !== -1} onClick={() => handleChecked(item)} />} label={item} key={item} />
            ))}
          </FormGroup>
    )
}