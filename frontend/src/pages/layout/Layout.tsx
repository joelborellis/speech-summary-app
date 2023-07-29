import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import { Stack } from "@fluentui/react";



const Layout = (props: any) => {



    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Stack horizontal verticalAlign="center">                
                        <Link to="/" className={styles.headerTitleContainer}>
                            <h3 className={styles.headerTitle}>Speech Summarizer</h3>
                        </Link>
                    </Stack>
                </div>
            </header>
            <Outlet />

        </div>
    );
};

export default Layout;
