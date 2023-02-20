import { useMediaQuery } from '@mui/material'

export default function useView() {
    const ipad = useMediaQuery('(max-width:900px)')
    const mobile = useMediaQuery('(max-width:735px)')

    const view = {
        ipad: ipad,
        mobile: mobile
    }
    
    return {view}
}