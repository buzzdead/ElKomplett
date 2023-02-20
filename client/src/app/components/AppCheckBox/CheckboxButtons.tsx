import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import React, { useRef, useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'

interface Props {
    items: string[]
    checked?: string[]
    onChange: (items: string[]) => void
}

export default function CheckboxButtons({items, checked, onChange}: Props) {
    const [checkedItems, setCheckedItems] = useState(checked || [])
    const timer = useRef<NodeJS.Timeout>()

    const debouncedOnChange = () => {
        if(timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => {console.log("adsf"); onChange(checkedItems)}, 600)
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
        <FormGroup>
            {items.map(item => (
              <FormControlLabel control={<Checkbox checked={checkedItems.indexOf(item) !== -1} onClick={() => handleChecked(item)} />} label={item} key={item} />
            ))}
          </FormGroup>
    )
}