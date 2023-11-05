import React, { useState } from "react"
import { Outlet, NavLink } from "react-router-dom";
import { Container, Content, ClosedSideBar, OpenSideBar } from "./styles";

import { BsArrowRight } from "@react-icons/all-files/bs/BsArrowRight";
import { BsArrowLeft } from "@react-icons/all-files/bs/BsArrowLeft";
import { DiReact } from "@react-icons/all-files/di/DiReact";
import { IoMdNotifications } from "@react-icons/all-files/io/IoMdNotifications";
import { MdSettings } from "@react-icons/all-files/md/MdSettings";
import { RiLogoutCircleRLine } from "@react-icons/all-files/ri/RiLogoutCircleRLine";

import logoImg from "../../assets/react.png";
import userImg from "../../assets/eu.jpg";

const Sidebar: React.FunctionComponent = () => {
    const [sideBar, setSideBar] = useState(false);

	function handleChangeSideBar() {
		setSideBar((prevState) => !prevState);
	}
	return (
		<Container>
			<Content>
				{!sideBar ? (
					<ClosedSideBar>
						<nav>
							<button onClick={handleChangeSideBar}>
								<BsArrowRight />
							</button>

							<img src={logoImg} alt="Eu" />

							{/* Links principais do app */}
							<ul>
								<NavLink to="/">
									<DiReact />
								</NavLink>
								<NavLink to="/insights">
									<DiReact />
								</NavLink>
							</ul>
						</nav>
						<div>
							{/* Icones que pode não ser tão principais no app */}
							<ul>
								<a href="/" title="Notificações">
									<IoMdNotifications />
								</a>
								<a href="/" title="Configurações">
									<MdSettings />
								</a>
								<a href="/" title="Sair da conta">
									<RiLogoutCircleRLine />
								</a>
							</ul>

							<span>
								<img src={userImg} alt="Eu" />
							</span>
						</div>
					</ClosedSideBar>
				) : (
					<OpenSideBar>
						<section>
							<nav>
								<span>
									<button onClick={handleChangeSideBar}>
										<BsArrowLeft />
									</button>
								</span>
								<div>
									<img src={logoImg} alt="Eu" />
									<h1>Minha logo </h1>
								</div>

								{/* Icones principais do app */}
								<ul>
									<a href="/" title="Alguma coisa">
										<DiReact />
										<p>Alguma coisa</p>
									</a>
									<a href="/" title="Alguma coisa">
										<DiReact />
										<p>Alguma coisa</p>
									</a>
									<a href="/" title="Alguma coisa">
										<DiReact />
										<p>Alguma coisa</p>
									</a>
									<a href="/" title="Alguma coisa">
										<DiReact />
										<p>Alguma coisa</p>
									</a>
								</ul>
							</nav>
							<div>
								{/* Icones que pode não ser tão principais no app */}
								<ul>
									<a href="/">
										<IoMdNotifications />
										<p>Notificações</p>
									</a>
									<a href="/">
										<MdSettings />
										<p>Configurações</p>
									</a>
									<a href="/">
										<RiLogoutCircleRLine />
										<p> Sair da conta </p>
									</a>
								</ul>

								<span>
									<img src={userImg} alt="Eu" />
									<p>Tiago Gonçalves de Castro</p>
								</span>
							</div>
						</section>
						<aside onClick={handleChangeSideBar} />
					</OpenSideBar>
				)}
			</Content>
			<Outlet />
		</Container>
		
	);
}

export default Sidebar
