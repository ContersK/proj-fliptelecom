"use client";

import React, { useState, type ChangeEvent } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Text,
  VStack,
  Card,
  Stack,
} from "@chakra-ui/react";
import {
  Settings,
  Save,
  Bell,
  DollarSign,
  Shield,
  Database,
  UserPlus,
} from "lucide-react";
import { FieldHelper } from "@/components/FieldHelper";
import { SwitchField } from "@/components/SwitchField";

export default function ConfiguracoesPage() {
  // Estados para configurações gerais
  const [nomeEmpresa, setNomeEmpresa] = useState("FlipTelecom");
  const [emailSuporte, setEmailSuporte] = useState("suporte@fliptelecom.com");
  const [telefone, setTelefone] = useState("(11) 99999-9999");

  // Estados para configurações de comissões
  const [valorComissao, setValorComissao] = useState("300");
  const [metaMinima, setMetaMinima] = useState("90");
  const [diaFechamento, setDiaFechamento] = useState("5");

  // Estados para notificações
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [performanceAlerts, setPerformanceAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  // Estados para sistema
  const [autoBackup, setAutoBackup] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  // Estados para criação de usuários
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("SUPERVISOR");
  const [creatingUser, setCreatingUser] = useState(false);

  const handleSaveSettings = () => {
    // Aqui você implementaria a lógica para salvar as configurações
    alert("Configurações salvas com sucesso!");
  };

  const handleCreateUser = async () => {
    if (!userName || !userEmail || !userPassword) {
      alert("Preencha nome, email e senha.");
      return;
    }

    setCreatingUser(true);
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          password: userPassword,
          role: userRole,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Erro ao criar usuário");
      }

      alert("Usuário criado com sucesso!");
      setUserName("");
      setUserEmail("");
      setUserPassword("");
      setUserRole("SUPERVISOR");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar usuário");
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <Box>
      <VStack gap={8} align="stretch">
        {/* Cabeçalho */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" color="gray.700">
              Configurações do Sistema
            </Heading>
            <Text color="gray.500" fontSize="sm" mt={1}>
              Gerencie as configurações da plataforma
            </Text>
          </Box>
          <Button colorScheme="blue" size="md" onClick={handleSaveSettings}>
            <Icon as={Save} boxSize={4} mr={2} />
            Salvar Alterações
          </Button>
        </Flex>

        {/* Configurações Gerais */}
        <Card.Root bg="white" boxShadow="lg" borderRadius="xl">
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box bg="blue.50" p={3} borderRadius="lg">
                <Icon as={Settings} color="blue.600" boxSize={6} />
              </Box>
              <Box>
                <Heading size="md" color="gray.700">
                  Informações Gerais
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Dados básicos da empresa
                </Text>
              </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <FieldHelper label="Nome da Empresa">
                <Input
                  value={nomeEmpresa}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNomeEmpresa(e.target.value)
                  }
                  placeholder="Digite o nome da empresa"
                />
              </FieldHelper>

              <FieldHelper label="Email de Suporte">
                <Input
                  type="email"
                  value={emailSuporte}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmailSuporte(e.target.value)
                  }
                  placeholder="email@exemplo.com"
                />
              </FieldHelper>

              <FieldHelper label="Telefone de Contato">
                <Input
                  value={telefone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTelefone(e.target.value)
                  }
                  placeholder="(00) 00000-0000"
                />
              </FieldHelper>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>

        {/* Configurações de Comissões */}
        <Card.Root bg="white" boxShadow="lg" borderRadius="xl">
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box bg="green.50" p={3} borderRadius="lg">
                <Icon as={DollarSign} color="green.600" boxSize={6} />
              </Box>
              <Box>
                <Heading size="md" color="gray.700">
                  Configurações de Comissões
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Defina valores e regras para pagamento
                </Text>
              </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              <FieldHelper label="Valor da Comissão (R$)">
                <Input
                  type="number"
                  value={valorComissao}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setValorComissao(e.target.value)
                  }
                  placeholder="300"
                />
              </FieldHelper>

              <FieldHelper label="Meta Mínima (%)">
                <Input
                  type="number"
                  value={metaMinima}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setMetaMinima(e.target.value)
                  }
                  placeholder="90"
                />
              </FieldHelper>

              <FieldHelper label="Dia de Fechamento">
                <Input
                  type="number"
                  value={diaFechamento}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDiaFechamento(e.target.value)
                  }
                  placeholder="5"
                  min="1"
                  max="31"
                />
              </FieldHelper>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>

        {/* Notificações */}
        <Card.Root bg="white" boxShadow="lg" borderRadius="xl">
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box bg="purple.50" p={3} borderRadius="lg">
                <Icon as={Bell} color="purple.600" boxSize={6} />
              </Box>
              <Box>
                <Heading size="md" color="gray.700">
                  Notificações
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Configure alertas e avisos do sistema
                </Text>
              </Box>
            </Flex>

            <Stack gap={4}>
              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg="gray.50"
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color="gray.700">
                    Notificações por Email
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Receber atualizações por email
                  </Text>
                </Box>
                <SwitchField
                  checked={emailNotifications}
                  onCheckedChange={(checked) => setEmailNotifications(checked)}
                  colorScheme="blue"
                />
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg="gray.50"
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color="gray.700">
                    Alertas de Performance
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Notificar quando metas não são atingidas
                  </Text>
                </Box>
                <SwitchField
                  checked={performanceAlerts}
                  onCheckedChange={(checked) => setPerformanceAlerts(checked)}
                  colorScheme="blue"
                />
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg="gray.50"
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color="gray.700">
                    Alertas de Pagamento
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Notificar sobre comissões aprovadas
                  </Text>
                </Box>
                <SwitchField
                  checked={paymentAlerts}
                  onCheckedChange={(checked) => setPaymentAlerts(checked)}
                  colorScheme="blue"
                />
              </Flex>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Segurança */}
        <Card.Root bg="white" boxShadow="lg" borderRadius="xl">
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box bg="red.50" p={3} borderRadius="lg">
                <Icon as={Shield} color="red.600" boxSize={6} />
              </Box>
              <Box>
                <Heading size="md" color="gray.700">
                  Segurança
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Proteção e privacidade dos dados
                </Text>
              </Box>
            </Flex>

            <Stack gap={4}>
              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg="gray.50"
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color="gray.700">
                    Backup Automático
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Realizar backup diário dos dados
                  </Text>
                </Box>
                <SwitchField
                  checked={autoBackup}
                  onCheckedChange={(checked) => setAutoBackup(checked)}
                  colorScheme="green"
                />
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg="gray.50"
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color="gray.700">
                    Autenticação em Dois Fatores
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Adicionar camada extra de segurança
                  </Text>
                </Box>
                <SwitchField
                  checked={twoFactorAuth}
                  onCheckedChange={(checked) => setTwoFactorAuth(checked)}
                  colorScheme="green"
                />
              </Flex>

              <FieldHelper label="Timeout de Sessão (minutos)">
                <Input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSessionTimeout(e.target.value)
                  }
                  placeholder="30"
                  w={{ base: "100%", md: "300px" }}
                />
              </FieldHelper>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Usuários de Acesso */}
        <Card.Root bg="white" boxShadow="lg" borderRadius="xl">
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box bg="blue.50" p={3} borderRadius="lg">
                <Icon as={UserPlus} color="blue.600" boxSize={6} />
              </Box>
              <Box>
                <Heading size="md" color="gray.700">
                  Usuários de Acesso
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Crie logins para acesso ao sistema
                </Text>
              </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              <FieldHelper label="Nome Completo">
                <Input
                  value={userName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUserName(e.target.value)
                  }
                  placeholder="Ex: Maria Silva"
                />
              </FieldHelper>

              <FieldHelper label="Email de Acesso">
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUserEmail(e.target.value)
                  }
                  placeholder="email@empresa.com"
                />
              </FieldHelper>

              <FieldHelper label="Senha">
                <Input
                  type="password"
                  value={userPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUserPassword(e.target.value)
                  }
                  placeholder="Digite uma senha"
                />
              </FieldHelper>

              <FieldHelper label="Perfil de Acesso">
                <select
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #E2E8F0",
                  }}
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </FieldHelper>
            </SimpleGrid>

            <Flex justify="flex-end" mt={6}>
              <Button
                colorScheme="blue"
                onClick={handleCreateUser}
                loading={creatingUser}
              >
                Criar Usuário
              </Button>
            </Flex>
          </Card.Body>
        </Card.Root>

        {/* Zona de Perigo */}
        <Card.Root
          bg="white"
          boxShadow="lg"
          borderRadius="xl"
          borderColor="red.200"
          borderWidth="2px"
        >
          <Card.Body p={6}>
            <Flex align="center" gap={3} mb={6}>
              <Box bg="red.50" p={3} borderRadius="lg">
                <Icon as={Database} color="red.600" boxSize={6} />
              </Box>
              <Box>
                <Heading size="md" color="red.600">
                  Zona de Perigo
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Ações irreversíveis - use com cuidado
                </Text>
              </Box>
            </Flex>

            <Stack gap={4}>
              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg="red.50"
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color="gray.700">
                    Limpar Todos os Dados
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Remove todos os registros do sistema
                  </Text>
                </Box>
                <Button colorScheme="red" variant="outline" size="sm">
                  Limpar Dados
                </Button>
              </Flex>

              <Flex
                justify="space-between"
                align="center"
                p={4}
                bg="red.50"
                borderRadius="lg"
              >
                <Box>
                  <Text fontWeight="medium" color="gray.700">
                    Resetar Sistema
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Volta às configurações de fábrica
                  </Text>
                </Box>
                <Button colorScheme="red" variant="outline" size="sm">
                  Resetar
                </Button>
              </Flex>
            </Stack>
          </Card.Body>
        </Card.Root>
      </VStack>
    </Box>
  );
}
