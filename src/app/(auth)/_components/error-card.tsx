import { FaExclamationTriangle } from "react-icons/fa";

import { CardWrapper } from "./card-wrapper";

export const ErrorCard = () => {
	return (
		<CardWrapper
			headerTitle="Something went wrong!"
			headerSubtitle="Oops! Something went wrong!"
			backButtonHref="/login"
			backButtonLabel="Back to login"
		>
			<div className="w-full flex justify-center items-center">
				<FaExclamationTriangle className="text-destructive" />
			</div>
		</CardWrapper>
	);
};
