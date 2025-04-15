import {
  Body,
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

interface TwoFactorTokenProps {
  token: string;
}

export function TwoFactorToken({ token }: TwoFactorTokenProps) {
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
              Token
            </Heading>
            <Text className="mt-4 text-center text-sm text-gray-600">
              To confirm your email and create your account, utilize o token
              abaixo:
            </Text>
            <Section className="mt-6 text-center">
              <Text className="py-5 text-center text-3xl text-gray-600">
                {token}
              </Text>
            </Section>
            {/* <Text className="mt-6 text-center text-sm text-gray-600">...</Text> */}
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

export default TwoFactorToken;
