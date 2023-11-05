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
                            <div className={styles.shadowImage}>
                                <h3 className={styles.shadowTitle}>Shadow</h3>
                            </div>
                        </Link>
                        <Link to="/" className={styles.headerTitleContainer}>
                            <h3 className={styles.headerTitle}>Shadow Chat</h3>
                        </Link>
                        <Link to="/insights" className={styles.headerTitleContainer}>
                            <h3 className={styles.headerTitle}>Shadow Insights</h3>
                        </Link>
                    </Stack>
                </div>
            </header>
            <Outlet />
        </div>
    );
};

export default Layout;