"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";

import { newVerification } from "@/app/(auth)/actions/new-verification";
import { CardWrapper } from "./card-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

export const NewVerificationForm = () => {
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();
	const useEffectCalled = useRef(false);

	const searchParams = useSearchParams();

	const token = searchParams.get("token");

	const onSubmit = useCallback(() => {
		if (success || error) return;

		if (!token) {
			setError("Missing token!");
			return;
		}

		newVerification(token)
			.then((data) => {
				setSuccess(data.success);
				setError(data.error);
			})
			.catch(() => {
				setError("Something went wrong!");
			});
	}, [token, success, error]);

	useEffect(() => {
		if (!useEffectCalled.current) {
			useEffectCalled.current = true;
			onSubmit();
		}
	}, [onSubmit]);

	return (
		<CardWrapper
			headerTitle="Confirming your verification"
			headerSubtitle="Confirming your verification"
			backButtonLabel="Back to login"
			backButtonHref="/login"
		>
			<div className="flex items-center w-full justify-center">
				{!success && !error && <BeatLoader />}
				<FormSuccess message={success} />
				{!success && <FormError message={error} />}
			</div>
		</CardWrapper>
	);
};
