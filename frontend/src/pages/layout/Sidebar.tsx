import React, { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import styles from "./Sidebar.module.css";

import * as FaIcons from "react-icons/fa" 

import { SidebarData } from "./SidebarData";

const SidebarMenu = styled.div<{close: boolean}>`
    left: ${({ close}) => close ? '0' : '-100%'};
`


const Sidebar: React.FunctionComponent = () => {
    const [close, setClose] = useState(false)
    const showSidebar = () => setClose(!close)
    return (
        <>
            <div className={styles.container}>
                <Link to="#" className={styles.menuIconOpen} onClick={showSidebar}>
                    <FaIcons.FaBars />
                </Link>
            </div>

            <SidebarMenu className={styles.sidebarMenu} close={close}>
                <Link to="#" className={styles.menuIconClose} onClick={showSidebar}>
                    <FaIcons.FaTimes />
                </Link>

                {SidebarData.map((item, index) => {
                    return (
                        <li className={styles.menuItems} key={index}>
                            <Link to={item.path} className={styles.menuIconOpen}>
                                {item.icon}
                                <span style={{marginLeft: '16px'}}>{item.title}</span>
                            </Link>
                        </li>
                    )
                })}
            </SidebarMenu>
        </>
    )
}

export default Sidebar
