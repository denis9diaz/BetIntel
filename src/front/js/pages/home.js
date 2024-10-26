import React from "react";
import SeccionIntroduccion from "./SeccionIntroduccion";
import SeccionSecundaria from "./SeccionSecundaria";

export const Home = () => {
	
	return (
		<div className="home-container">
			<SeccionIntroduccion />
            <SeccionSecundaria />
		</div>
	);
};
