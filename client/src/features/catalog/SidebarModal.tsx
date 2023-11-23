import SideBar from "features/SideBar"
import './catalog.css'
import { Box } from "@mui/material"

interface Props {
    producers: string[]
    productTypes: string[]
    showModal: boolean
    onClose: () => void
}

export const SidebarModal = (props: Props) => {
    return (
    <>
    <div className={`overlay ${props.showModal ? 'show' : ''}`} onClick={props.onClose}></div>
    
    <Box sx={{backgroundColor: 'special2'}} className={`filter-modal ${props.showModal ? 'show' : ''}`}>
        <SideBar producers={props.producers} productTypes={props.productTypes} />

    </Box>
    </>)
}