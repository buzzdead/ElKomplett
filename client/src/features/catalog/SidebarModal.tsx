import SideBar from "features/SideBar"
import { ProductTypes } from "features/admin/AdvancedInventory/SidebarItems/ProductTypes"
import './catalog.css'

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
    
    <div className={`filter-modal ${props.showModal ? 'show' : ''}`}>
        <SideBar producers={props.producers} productTypes={props.productTypes} />

    </div>
    </>)
}