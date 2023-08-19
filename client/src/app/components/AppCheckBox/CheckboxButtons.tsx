import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import React, { useRef, useState, useEffect } from 'react'
import { useUpdateEffect } from 'usehooks-ts'

interface Props {
    items: string[]
    checked?: string[]
    flexRow?: boolean
    onChange: (items: string[]) => void
    onStateUpdate?: (loading: boolean) => void
}

export default function CheckboxButtons({items, checked, onChange, flexRow = false, onStateUpdate}: Props) {
    const [checkedItems, setCheckedItems] = useState(checked || [])
    const [loading, setLoading] = useState(false)
    const timer = useRef<NodeJS.Timeout>()
    const onStateUpdateRef = useRef(onStateUpdate)

    useEffect(() => {
        onStateUpdateRef.current = onStateUpdate
    }, [onStateUpdate])

    const debouncedOnChange = () => {
        if(timer.current) clearTimeout(timer.current)
        setLoading(true)
        timer.current = setTimeout(() => {
            onChange(checkedItems)
            setLoading(false)
        }, 300)
    }

    useUpdateEffect(() => {
        debouncedOnChange()
    }, [checkedItems])

    useEffect(() => {
        if (onStateUpdateRef.current) {
            onStateUpdateRef.current(loading)
        }
    }, [loading])

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
