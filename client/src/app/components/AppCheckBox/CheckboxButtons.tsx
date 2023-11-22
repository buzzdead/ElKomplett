import { FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material'
import Render from 'app/layout/Render'
import React, { useRef, useState, useEffect } from 'react'
import { useUpdateEffect } from 'usehooks-ts'

interface Props {
    items: string[]
    checked?: string[]
    flexRow?: boolean
    color?: string
    onChange: (items: string[]) => void
    onStateUpdate?: (loading: boolean) => void
    resetFunction?: () => void
}

export default function CheckboxButtons({items, checked, onChange, flexRow = false, onStateUpdate, resetFunction, color = 'mode'}: Props) {
    const [checkedItems, setCheckedItems] = useState(checked || [])
    const [loading, setLoading] = useState(false)
    const timer = useRef<NodeJS.Timeout>()
    const halt = useRef(false)
    const onStateUpdateRef = useRef(onStateUpdate)

    useEffect(() => {
        const newChecked = checkedItems.filter(c => items.includes(c));
        const hasChanged = checkedItems.some(c => !newChecked.includes(c))
        if(hasChanged) {setCheckedItems(newChecked); halt.current = true; onChange(newChecked);}
    }, [items])

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
        if(halt.current) {halt.current = false; return;}
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

    const reset = () => {
        setCheckedItems([])
    }

    return (
        <div style={{ position: 'relative' }}>
            <div style={{position: 'absolute', right: 0, display: 'flex'}}>
            <Render condition={resetFunction !== undefined && checkedItems.length > 0}>
                <Button style={{padding: 0, minWidth: 0}} onClick={reset}>X</Button>
            </Render>
            </div>
        <FormGroup sx={{display: 'flex', flexDirection: flexRow ? 'row' : 'column' }}>
            {items.map(item => (
              <FormControlLabel sx={{color: color}} control={<Checkbox checked={checkedItems.indexOf(item) !== -1} onClick={() => handleChecked(item)} />} label={item} key={item} />
            ))}
          </FormGroup>
          </div>
    )
}
