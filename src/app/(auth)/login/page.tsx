'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  InputGroup,
  Image,
  Flex,
  Icon,
  HStack,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { MdLock, MdMail, MdArrowForward, MdCheckCircle, MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ email: '', password: '' });
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Estados para modal de esqueci senha
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotError('Informe seu email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotError('Email inválido.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');

    try {
      const res = await fetch('/api/reset-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao solicitar reset');
      }

      setForgotSuccess(true);
    } catch (error) {
      setForgotError(error instanceof Error ? error.message : 'Erro ao solicitar reset');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setForgotPasswordOpen(false);
    setForgotEmail('');
    setForgotSuccess(false);
    setForgotError('');
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'O email é obrigatório.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Formato de email inválido.';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'A senha é obrigatória.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      console.log('Tentando login com:', { email, password: '***' });

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Status da resposta:', res.status);

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
        console.log('Erro da API:', data);
        throw new Error(data.message ?? 'Credenciais inválidas');
      }

      const data = await res.json();
      console.log('Login bem-sucedido:', data);

      setIsSuccess(true);
      setTimeout(() => {
        router.replace('/');
      }, 1200);
    } catch (error) {
      console.error('Erro no login:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao conectar ao servidor';
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-30px, -30px);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, 30px);
          }
        }

        @keyframes logoFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes successFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.6s ease-out;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: floatReverse 6s ease-in-out infinite;
        }

        .animate-logo {
          animation: logoFadeIn 0.8s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out;
        }

        .animate-spin {
          animation: spin 0.8s linear infinite;
        }

        .animate-success {
          animation: successFade 0.3s ease-out;
        }

        .gradient-bg {
          background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }
      `}</style>

      <Box
        h="100vh"
        w="100vw"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
        backgroundImage="url('/login-bg.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'blackAlpha.500',
          zIndex: 0,
        }}
      >
        {/* Elementos Decorativos Removidos para não sobrepor o background */}

        {/* Card de Login */}
        <Box
          w="full"
          maxW="420px"
          mx={4}
          position="relative"
          zIndex="1"
          className="animate-slide-in"
        >
          <Box
            bg="white"
            p={{ base: 6, md: 8 }}
            borderRadius="3xl"
            boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            backdropFilter="blur(20px)"
            position="relative"
          >
            {/* Overlay de Sucesso */}
            {isSuccess && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="green.500"
                borderRadius="3xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                zIndex="10"
                className="animate-success"
              >
                <VStack gap={3}>
                  <Box className="animate-scale-in">
                    <Icon as={MdCheckCircle} boxSize={16} color="white" />
                  </Box>
                  <Text color="white" fontSize="xl" fontWeight="bold">
                    Login realizado com sucesso!
                  </Text>
                </VStack>
              </Box>
            )}

            <VStack gap={8} as="form" onSubmit={handleSubmit}>
              {/* LOGO */}
              <VStack gap={3} textAlign="center" w="full">
                <Box className="animate-logo">
                  <Image
                    src="/logo-flip.png"
                    alt="Flip Telecom Logo"
                    maxW="280px"
                    objectFit="contain"
                    mx="auto"
                  />
                </Box>
                <Box>
                  <Text color="gray.700" fontSize="xl" fontWeight="bold" mb={1}>
                    Bem-vindo de volta!
                  </Text>
                  <Text color="gray.500" fontSize="sm" fontWeight="medium">
                    Sistema de Gestão de Comissões
                  </Text>
                </Box>
              </VStack>

              {/* ERRO GERAL */}
              {generalError && (
                <Box
                  w="full"
                  p={4}
                  bg="red.50"
                  borderRadius="xl"
                  borderLeft="4px solid"
                  borderLeftColor="red.500"
                  className="animate-shake"
                >
                  <Text color="red.700" fontSize="sm" fontWeight="medium">
                    {generalError}
                  </Text>
                </Box>
              )}

              {/* INPUTS */}
              <VStack gap={5} w="full">
                {/* EMAIL */}
                <Box w="full">
                  <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
                    Email Corporativo
                  </Text>
                  <InputGroup
                    w="full"
                    startElement={
                      <Icon
                        as={MdMail}
                        boxSize={5}
                        color={errors.email ? 'red.500' : 'blue.500'}
                        ml={3}
                      />
                    }
                  >
                    <Input
                      name="email"
                      type="email"
                      placeholder="seu.email@fliptelecom.com.br"
                      value={email}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);
                        setGeneralError(null);
                        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                          setErrors({ ...errors, email: 'Email inválido' });
                        } else if (!value) {
                          setErrors({
                            ...errors,
                            email: 'Email é obrigatório',
                          });
                        } else {
                          setErrors({ ...errors, email: '' });
                        }
                      }}
                      size="lg"
                      bg="gray.50"
                      border="2px solid"
                      borderColor={errors.email ? 'red.300' : 'gray.200'}
                      color="gray.800"
                      fontSize="md"
                      _hover={{
                        borderColor: errors.email ? 'red.400' : 'blue.300',
                      }}
                      _focus={{
                        borderColor: errors.email ? 'red.500' : 'blue.500',
                        bg: 'white',
                        boxShadow: errors.email
                          ? '0 0 0 3px rgba(229, 62, 62, 0.1)'
                          : '0 0 0 3px rgba(66, 153, 225, 0.1)',
                      }}
                      transition="all 0.2s"
                      autoComplete="username"
                    />
                  </InputGroup>
                  {errors.email && (
                    <Text
                      color="red.500"
                      fontSize="sm"
                      fontWeight="semibold"
                      mt={2}
                      ml={1}
                      className="animate-fade-in"
                    >
                      {errors.email}
                    </Text>
                  )}
                </Box>

                {/* SENHA */}
                <Box w="full">
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.700">
                      Senha
                    </Text>
                    <Text
                      fontSize="xs"
                      color="blue.600"
                      fontWeight="semibold"
                      cursor="pointer"
                      onClick={() => setForgotPasswordOpen(true)}
                      _hover={{
                        color: 'blue.700',
                        textDecoration: 'underline',
                      }}
                      transition="all 0.2s"
                    >
                      Esqueceu a senha?
                    </Text>
                  </Flex>
                  <InputGroup
                    w="full"
                    startElement={
                      <Icon
                        as={MdLock}
                        boxSize={5}
                        color={errors.password ? 'red.500' : 'blue.500'}
                        ml={3}
                      />
                    }
                  >
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPassword(value);
                        setGeneralError(null);
                        if (value && value.length < 6) {
                          setErrors({
                            ...errors,
                            password: 'Mínimo 6 caracteres',
                          });
                        } else if (!value) {
                          setErrors({
                            ...errors,
                            password: 'Senha é obrigatória',
                          });
                        } else {
                          setErrors({ ...errors, password: '' });
                        }
                      }}
                      size="lg"
                      bg="gray.50"
                      border="2px solid"
                      borderColor={errors.password ? 'red.300' : 'gray.200'}
                      color="gray.800"
                      fontSize="md"
                      _hover={{
                        borderColor: errors.password ? 'red.400' : 'blue.300',
                      }}
                      _focus={{
                        borderColor: errors.password ? 'red.500' : 'blue.500',
                        bg: 'white',
                        boxShadow: errors.password
                          ? '0 0 0 3px rgba(229, 62, 62, 0.1)'
                          : '0 0 0 3px rgba(66, 153, 225, 0.1)',
                      }}
                      transition="all 0.2s"
                      autoComplete="current-password"
                    />
                  </InputGroup>
                  {errors.password && (
                    <Text
                      color="red.500"
                      fontSize="sm"
                      fontWeight="semibold"
                      mt={2}
                      ml={1}
                      className="animate-fade-in"
                    >
                      {errors.password}
                    </Text>
                  )}
                </Box>
              </VStack>

              {/* BOTÃO */}
              <Button
                type="submit"
                size="lg"
                w="full"
                h="56px"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
                fontSize="md"
                fontWeight="bold"
                disabled={loading || isSuccess}
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                transition="all 0.3s"
                mt={2}
              >
                {loading ? (
                  <HStack>
                    <Box
                      w="20px"
                      h="20px"
                      border="3px solid"
                      borderColor="whiteAlpha.300"
                      borderTopColor="white"
                      borderRadius="full"
                      className="animate-spin"
                    />
                    <Text>Validando credenciais...</Text>
                  </HStack>
                ) : (
                  <HStack justify="center" gap={2}>
                    <Text>ACESSAR SISTEMA</Text>
                    <Icon as={MdArrowForward} boxSize={5} />
                  </HStack>
                )}
              </Button>

              {/* Footer */}
              <VStack gap={2} mt={4}>
                <Text fontSize="xs" color="gray.400" textAlign="center">
                  © 2026 Flip Telecom. Todos os direitos reservados.
                </Text>
                <HStack gap={4} fontSize="xs" color="gray.500">
                  <Text cursor="pointer" _hover={{ color: 'blue.600' }}>
                    Termos de Uso
                  </Text>
                  <Text>•</Text>
                  <Text cursor="pointer" _hover={{ color: 'blue.600' }}>
                    Privacidade
                  </Text>
                  <Text>•</Text>
                  <Text cursor="pointer" _hover={{ color: 'blue.600' }}>
                    Suporte
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </Box>

      {/* Modal Esqueci Minha Senha */}
      <Dialog.Root open={forgotPasswordOpen} onOpenChange={(e) => !e.open && closeForgotModal()}>
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <Dialog.Positioner>
            <Dialog.Content
              bg="white"
              borderRadius="2xl"
              boxShadow="2xl"
              maxW="400px"
              w="90%"
              p={0}
              overflow="hidden"
            >
              {/* Header */}
              <Box bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" p={6} position="relative">
                <Dialog.CloseTrigger
                  position="absolute"
                  top={4}
                  right={4}
                  color="white"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  borderRadius="full"
                  p={1}
                >
                  <Icon as={MdClose} boxSize={5} />
                </Dialog.CloseTrigger>
                <VStack gap={2} align="center">
                  <Box bg="whiteAlpha.200" p={3} borderRadius="full">
                    <Icon as={MdLock} boxSize={8} color="white" />
                  </Box>
                  <Dialog.Title color="white" fontSize="xl" fontWeight="bold">
                    Recuperar Senha
                  </Dialog.Title>
                  <Dialog.Description color="whiteAlpha.800" fontSize="sm" textAlign="center">
                    Informe seu email e enviaremos uma solicitação aos administradores.
                  </Dialog.Description>
                </VStack>
              </Box>

              {/* Body */}
              <Box p={6}>
                {forgotSuccess ? (
                  <VStack gap={4} py={4}>
                    <Box bg="green.100" p={4} borderRadius="full">
                      <Icon as={MdCheckCircle} boxSize={12} color="green.500" />
                    </Box>
                    <Text fontWeight="bold" color="gray.800" fontSize="lg">
                      Solicitação Enviada!
                    </Text>
                    <Text color="gray.600" textAlign="center" fontSize="sm">
                      Os administradores foram notificados. Você receberá uma nova senha em breve.
                    </Text>
                    <Button
                      w="full"
                      bg="gray.100"
                      color="gray.700"
                      _hover={{ bg: 'gray.200' }}
                      onClick={closeForgotModal}
                    >
                      Fechar
                    </Button>
                  </VStack>
                ) : (
                  <VStack gap={4}>
                    <Box w="full">
                      <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                        Seu Email
                      </Text>
                      <InputGroup
                        w="full"
                        startElement={<Icon as={MdMail} boxSize={5} color="blue.500" ml={3} />}
                      >
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          value={forgotEmail}
                          onChange={(e) => {
                            setForgotEmail(e.target.value);
                            setForgotError('');
                          }}
                          size="lg"
                          bg="gray.50"
                          border="2px solid"
                          borderColor="gray.200"
                          _focus={{
                            borderColor: 'blue.500',
                            bg: 'white',
                          }}
                        />
                      </InputGroup>
                      {forgotError && (
                        <Text color="red.500" fontSize="sm" mt={2}>
                          {forgotError}
                        </Text>
                      )}
                    </Box>

                    <Button
                      w="full"
                      size="lg"
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      color="white"
                      fontWeight="bold"
                      onClick={handleForgotPassword}
                      disabled={forgotLoading}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                      }}
                    >
                      {forgotLoading ? 'Enviando...' : 'Solicitar Nova Senha'}
                    </Button>

                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Um administrador irá resetar sua senha e você poderá acessar novamente.
                    </Text>
                  </VStack>
                )}
              </Box>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
