import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface PasswordResetProps {
  url: string;
}

export function PasswordReset({ url }: PasswordResetProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <Section className="text-center">
              <Img
                src="https://www.99boost.io/99boost-Logo1.svg"
                alt="99Boost Logo"
                className="mx-auto h-12 w-12"
              />
            </Section>
            <Heading className="mt-6 text-center text-xl font-bold text-gray-800">
              Reset Your Password
            </Heading>
            <Text className="mt-4 text-center text-sm text-gray-600">
              Click the button below to reset your password. This link is valid
              for <strong> 24 hours </strong>.
            </Text>
            <Section className="mt-6 text-center">
              <Button
                href={url}
                className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-500"
              >
                Reset Password
              </Button>
            </Section>
            <Text className="mt-6 text-center text-sm text-gray-600">
              If you did not request a password reset, please ignore this email.
            </Text>
            <Hr className="my-6 border-gray-200" />
            <Link
              href="https://99boost.io"
              className="block text-center text-sm text-black/70"
            >
              99Boost.io
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default PasswordReset;
