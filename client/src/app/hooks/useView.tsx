import { useMediaQuery } from '@mui/material'

export default function useView() {
    const custom = useMediaQuery('(max-width:1400px')
    const ipad = useMediaQuery('(max-width:900px)')
    const mobile = useMediaQuery('(max-width:735px)')

    const view = {
        ipad: ipad,
        custom: custom,
        mobile: mobile
    }
    
    return {view}
}