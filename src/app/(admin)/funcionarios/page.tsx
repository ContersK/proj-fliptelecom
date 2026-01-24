"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Table,
  Badge,
  Input,
  IconButton,
  Flex,
  Avatar,
  Drawer,
  Spinner,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  DialogBackdrop,
  Grid,
} from "@chakra-ui/react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  BarChart3,
} from "lucide-react";

// Tipo do Funcionário
interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  turno: string;
  status: string;
}

interface MetricasForm {
  funcionarioId: string;
  funcionarioNome: string;
  month: number;
  year: number;
  countNota5: number;
  countNota4: number;
  countNota3: number;
  countNota2: number;
  countNota1: number;
}

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMetricasDrawerOpen, setIsMetricasDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado do Formulário
  const [formData, setFormData] = useState<Partial<Funcionario>>({
    nome: "",
    email: "",
    cargo: "Suporte N1",
    turno: "A",
    status: "ATIVO",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Estado do Formulário de Métricas
  const [metricasForm, setMetricasForm] = useState<MetricasForm>({
    funcionarioId: "",
    funcionarioNome: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    countNota5: 0,
    countNota4: 0,
    countNota3: 0,
    countNota2: 0,
    countNota1: 0,
  });
  const [savingMetricas, setSavingMetricas] = useState(false);

  // 1. CARREGAR DADOS DO BANCO
  async function fetchFuncionarios() {
    setLoading(true);
    try {
      const res = await fetch("/api/funcionarios");
      const data = await res.json();
      setFuncionarios(data);
    } catch (error) {
      console.error("Erro ao buscar", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  // 2. ABRIR GAVETA (NOVO ou EDITAR)
  function handleOpenDrawer(funcionario?: Funcionario) {
    if (funcionario) {
      setEditingId(funcionario.id);
      setFormData(funcionario);
    } else {
      setEditingId(null);
      setFormData({
        nome: "",
        email: "",
        cargo: "Suporte N1",
        turno: "A",
        status: "ATIVO",
      });
    }
    setIsDrawerOpen(true);
  }

  // 3. SALVAR (CREATE ou UPDATE)
  async function handleSave() {
    if (!formData.nome || !formData.turno)
      return alert("Preencha os campos obrigatórios");

    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/funcionarios/${editingId}`
        : "/api/funcionarios";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      await fetchFuncionarios(); // Atualiza a lista
      setIsDrawerOpen(false); // Fecha a gaveta
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
      alert("Erro ao salvar funcionário");
    } finally {
      setSaving(false);
    }
  }

  // 4. DELETAR
  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    try {
      await fetch(`/api/funcionarios/${id}`, { method: "DELETE" });
      fetchFuncionarios();
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
      alert("Erro ao deletar");
    }
  }

  // 5. ABRIR MODAL DE MÉTRICAS
  function handleOpenMetricas(funcionario: Funcionario) {
    setMetricasForm({
      funcionarioId: funcionario.id,
      funcionarioNome: funcionario.nome,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      countNota5: 0,
      countNota4: 0,
      countNota3: 0,
      countNota2: 0,
      countNota1: 0,
    });
    setIsMetricasDrawerOpen(true);
  }

  // 6. SALVAR MÉTRICAS
  async function handleSaveMetricas() {
    setSavingMetricas(true);
    try {
      const res = await fetch("/api/metricas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funcionarioId: metricasForm.funcionarioId,
          month: metricasForm.month,
          year: metricasForm.year,
          countNota5: metricasForm.countNota5,
          countNota4: metricasForm.countNota4,
          countNota3: metricasForm.countNota3,
          countNota2: metricasForm.countNota2,
          countNota1: metricasForm.countNota1,
        }),
      });

      if (!res.ok) throw new Error("Erro ao salvar métricas");

      alert("Métricas salvas com sucesso!");
      setIsMetricasDrawerOpen(false);
    } catch (error) {
      console.error("Erro ao salvar métricas:", error);
      alert("Erro ao salvar métricas");
    } finally {
      setSavingMetricas(false);
    }
  }

  // Filtro de Busca
  const filtered = funcionarios.filter((f) =>
    f.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box>
      {/* CABEÇALHO DA PÁGINA */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg" color="gray.700">
            Equipe
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Gerencie seus colaboradores
          </Text>
        </Box>
        <Button
          onClick={() => handleOpenDrawer()}
          bg="#0044CC"
          color="white"
          _hover={{ bg: "#003399" }}
          size="sm"
        >
          <Plus size={18} style={{ marginRight: 8 }} />
          Novo Funcionário
        </Button>
      </Flex>

      {/* BARRA DE FILTROS */}
      <Box bg="white" p={4} borderRadius="xl" boxShadow="sm" mb={6}>
        <HStack>
          <Box position="relative" w="300px">
            <Input
              placeholder="Buscar por nome..."
              pl={10}
              bg="gray.50"
              border="none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Box
              position="absolute"
              left={3}
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
            >
              <Search size={18} />
            </Box>
          </Box>
        </HStack>
      </Box>

      {/* TABELA DE FUNCIONÁRIOS */}
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="sm"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.100"
      >
        {loading ? (
          <Flex p={10} justify="center">
            <Spinner color="blue.500" />
          </Flex>
        ) : (
          <Table.Root size="md" interactive>
            <Table.Header bg="gray.50">
              <Table.Row>
                <Table.ColumnHeader pl={6}>Colaborador</Table.ColumnHeader>
                <Table.ColumnHeader>Cargo</Table.ColumnHeader>
                <Table.ColumnHeader>Turno</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end" pr={6}>
                  Ações
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((func) => (
                <Table.Row key={func.id} _hover={{ bg: "gray.50" }}>
                  <Table.Cell pl={6}>
                    <HStack gap={3}>
                      <Avatar.Root size="sm" bg="blue.100" color="blue.700">
                        <Avatar.Fallback>
                          {func.nome.substring(0, 2).toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <Box>
                        <Text fontWeight="medium" color="gray.800">
                          {func.nome}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {func.email || "Sem email"}
                        </Text>
                      </Box>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell color="gray.600">{func.cargo}</Table.Cell>
                  <Table.Cell>
                    <Badge variant="subtle" colorPalette="blue">
                      {func.turno}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant="solid"
                      colorPalette={func.status === "ATIVO" ? "green" : "red"}
                      size="sm"
                    >
                      {func.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="end" pr={6}>
                    <HStack justify="end" gap={2}>
                      <IconButton
                        aria-label="Registrar Notas"
                        variant="ghost"
                        size="sm"
                        color="purple.500"
                        _hover={{ color: "purple.600", bg: "purple.50" }}
                        onClick={() => handleOpenMetricas(func)}
                      >
                        <BarChart3 size={16} />
                      </IconButton>
                      <IconButton
                        aria-label="Editar"
                        variant="ghost"
                        size="sm"
                        color="gray.500"
                        onClick={() => handleOpenDrawer(func)}
                      >
                        <Edit2 size={16} />
                      </IconButton>
                      <IconButton
                        aria-label="Excluir"
                        variant="ghost"
                        size="sm"
                        color="red.400"
                        _hover={{ color: "red.600", bg: "red.50" }}
                        onClick={() => handleDelete(func.id)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>

      {/* --- DRAWER (GAVETA) DE CADASTRO/EDIÇÃO --- */}
      {/* Usando Drawer.Root do Chakra v3 */}
      <Drawer.Root
        open={isDrawerOpen}
        onOpenChange={(e) => setIsDrawerOpen(e.open)}
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header
              borderBottom="1px solid"
              borderColor="gray.100"
              pb={4}
            >
              <Drawer.Title>
                {editingId ? "Editar Funcionário" : "Novo Colaborador"}
              </Drawer.Title>
              <Drawer.CloseTrigger />
            </Drawer.Header>

            <Drawer.Body py={6}>
              <VStack gap={5} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>
                    Nome Completo
                  </Text>
                  <Input
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    placeholder="Ex: Rafael Alencar"
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>
                    Email Corporativo
                  </Text>
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@flip.com"
                  />
                </Box>

                <HStack gap={4}>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Turno
                    </Text>
                    {/* Select simples nativo para evitar complexidade do v3 agora */}
                    <select
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #E2E8F0",
                      }}
                      value={formData.turno}
                      onChange={(e) =>
                        setFormData({ ...formData, turno: e.target.value })
                      }
                    >
                      <option value="A">Turno A</option>
                      <option value="B">Turno B</option>
                      <option value="C">Turno C</option>
                      <option value="COMERCIAL">Comercial</option>
                    </select>
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Cargo
                    </Text>
                    <Input
                      value={formData.cargo}
                      onChange={(e) =>
                        setFormData({ ...formData, cargo: e.target.value })
                      }
                    />
                  </Box>
                </HStack>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>
                    Status
                  </Text>
                  <HStack gap={3}>
                    <Button
                      size="sm"
                      variant={
                        formData.status === "ATIVO" ? "solid" : "outline"
                      }
                      colorPalette="green"
                      onClick={() =>
                        setFormData({ ...formData, status: "ATIVO" })
                      }
                    >
                      <UserCheck size={16} style={{ marginRight: 4 }} /> Ativo
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        formData.status === "INATIVO" ? "solid" : "outline"
                      }
                      colorPalette="red"
                      onClick={() =>
                        setFormData({ ...formData, status: "INATIVO" })
                      }
                    >
                      <UserX size={16} style={{ marginRight: 4 }} /> Inativo
                    </Button>
                  </HStack>
                </Box>
              </VStack>
            </Drawer.Body>

            <Drawer.Footer borderTop="1px solid" borderColor="gray.100" pt={4}>
              <Button
                variant="outline"
                mr={3}
                onClick={() => setIsDrawerOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                bg="#0044CC"
                color="white"
                onClick={handleSave}
                loading={saving}
              >
                {editingId ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>

      {/* --- MODAL DE REGISTRO DE MÉTRICAS/NOTAS --- */}
      <DialogRoot
        open={isMetricasDrawerOpen}
        onOpenChange={(e) => setIsMetricasDrawerOpen(e.open)}
      >
        <DialogBackdrop bg="blackAlpha.600" />
        <DialogContent
          maxW="750px"
          maxH={{ base: "90vh", md: "85vh" }}
          h="auto"
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          my="auto"
        >
          <DialogHeader
            borderBottom="1px solid"
            borderColor="gray.200"
            py={4}
            px={6}
            flexShrink={0}
            bg="white"
            zIndex={1}
          >
            <DialogTitle fontSize="xl" fontWeight="bold" color="gray.800">
              Registrar Notas - {metricasForm.funcionarioNome}
            </DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>

          <DialogBody
            py={5}
            px={6}
            overflowY="auto"
            flex={1}
            css={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}
          >
            <VStack gap={5} align="stretch">
              {/* Período de Referência */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={3}
                  color="gray.700"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Período de Referência
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" mb={2} fontWeight="medium">
                      Mês
                    </Text>
                    <select
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "15px",
                        borderRadius: "8px",
                        border: "2px solid #E2E8F0",
                        backgroundColor: "white",
                        cursor: "pointer",
                      }}
                      value={metricasForm.month}
                      onChange={(e) =>
                        setMetricasForm({
                          ...metricasForm,
                          month: parseInt(e.target.value),
                        })
                      }
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                          {new Date(2000, m - 1).toLocaleDateString("pt-BR", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                  </Box>
                  <Box>
                    <Text fontSize="sm" mb={2} fontWeight="medium">
                      Ano
                    </Text>
                    <Input
                      type="number"
                      size="lg"
                      fontSize="15px"
                      value={metricasForm.year}
                      onChange={(e) =>
                        setMetricasForm({
                          ...metricasForm,
                          year: parseInt(e.target.value),
                        })
                      }
                    />
                  </Box>
                </Grid>
              </Box>

              {/* Avaliações */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={3}
                  color="gray.700"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Quantidade de Avaliações por Nota
                </Text>

                <VStack gap={3} align="stretch">
                  {/* Nota 5 */}
                  <Box
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor="gray.200"
                    transition="all 0.2s"
                    _hover={{ borderColor: "purple.300", shadow: "md" }}
                  >
                    <Flex justify="space-between" align="center" gap={4}>
                      <HStack gap={4} flex={1}>
                        <Box
                          bg="gradient-to-br from-yellow-300 to-yellow-500"
                          p={3}
                          borderRadius="xl"
                          minW="60px"
                          h="60px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow="lg"
                        >
                          <Text fontSize="2xl">⭐</Text>
                        </Box>
                        <VStack align="start" gap={0.5}>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color="gray.800"
                          >
                            Nota 5
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Excelente
                          </Text>
                        </VStack>
                      </HStack>
                      <Input
                        type="number"
                        min="0"
                        w="140px"
                        size="xl"
                        fontSize="24px"
                        textAlign="center"
                        fontWeight="bold"
                        color="gray.700"
                        borderWidth="2px"
                        _focus={{
                          borderColor: "purple.500",
                          shadow: "outline",
                        }}
                        value={metricasForm.countNota5}
                        onChange={(e) =>
                          setMetricasForm({
                            ...metricasForm,
                            countNota5: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </Flex>
                  </Box>

                  {/* Nota 4 */}
                  <Box
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor="gray.200"
                    transition="all 0.2s"
                    _hover={{ borderColor: "purple.300", shadow: "md" }}
                  >
                    <Flex justify="space-between" align="center" gap={4}>
                      <HStack gap={4} flex={1}>
                        <Box
                          bg="gradient-to-br from-yellow-300 to-yellow-500"
                          p={3}
                          borderRadius="xl"
                          minW="60px"
                          h="60px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow="lg"
                        >
                          <Text fontSize="2xl">⭐</Text>
                        </Box>
                        <VStack align="start" gap={0.5}>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color="gray.800"
                          >
                            Nota 4
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Muito Bom
                          </Text>
                        </VStack>
                      </HStack>
                      <Input
                        type="number"
                        min="0"
                        w="140px"
                        size="xl"
                        fontSize="24px"
                        textAlign="center"
                        fontWeight="bold"
                        color="gray.700"
                        borderWidth="2px"
                        _focus={{
                          borderColor: "purple.500",
                          shadow: "outline",
                        }}
                        value={metricasForm.countNota4}
                        onChange={(e) =>
                          setMetricasForm({
                            ...metricasForm,
                            countNota4: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </Flex>
                  </Box>

                  {/* Nota 3 */}
                  <Box
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor="gray.200"
                    transition="all 0.2s"
                    _hover={{ borderColor: "purple.300", shadow: "md" }}
                  >
                    <Flex justify="space-between" align="center" gap={4}>
                      <HStack gap={4} flex={1}>
                        <Box
                          bg="gradient-to-br from-yellow-300 to-yellow-500"
                          p={3}
                          borderRadius="xl"
                          minW="60px"
                          h="60px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow="lg"
                        >
                          <Text fontSize="2xl">⭐</Text>
                        </Box>
                        <VStack align="start" gap={0.5}>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color="gray.800"
                          >
                            Nota 3
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Regular
                          </Text>
                        </VStack>
                      </HStack>
                      <Input
                        type="number"
                        min="0"
                        w="140px"
                        size="xl"
                        fontSize="24px"
                        textAlign="center"
                        fontWeight="bold"
                        color="gray.700"
                        borderWidth="2px"
                        _focus={{
                          borderColor: "purple.500",
                          shadow: "outline",
                        }}
                        value={metricasForm.countNota3}
                        onChange={(e) =>
                          setMetricasForm({
                            ...metricasForm,
                            countNota3: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </Flex>
                  </Box>

                  {/* Nota 2 */}
                  <Box
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor="gray.200"
                    transition="all 0.2s"
                    _hover={{ borderColor: "purple.300", shadow: "md" }}
                  >
                    <Flex justify="space-between" align="center" gap={4}>
                      <HStack gap={4} flex={1}>
                        <Box
                          bg="gradient-to-br from-yellow-300 to-yellow-500"
                          p={3}
                          borderRadius="xl"
                          minW="60px"
                          h="60px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow="lg"
                        >
                          <Text fontSize="2xl">⭐</Text>
                        </Box>
                        <VStack align="start" gap={0.5}>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color="gray.800"
                          >
                            Nota 2
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Ruim
                          </Text>
                        </VStack>
                      </HStack>
                      <Input
                        type="number"
                        min="0"
                        w="140px"
                        size="xl"
                        fontSize="24px"
                        textAlign="center"
                        fontWeight="bold"
                        color="gray.700"
                        borderWidth="2px"
                        _focus={{
                          borderColor: "purple.500",
                          shadow: "outline",
                        }}
                        value={metricasForm.countNota2}
                        onChange={(e) =>
                          setMetricasForm({
                            ...metricasForm,
                            countNota2: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </Flex>
                  </Box>

                  {/* Nota 1 */}
                  <Box
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor="gray.200"
                    transition="all 0.2s"
                    _hover={{ borderColor: "purple.300", shadow: "md" }}
                  >
                    <Flex justify="space-between" align="center" gap={4}>
                      <HStack gap={4} flex={1}>
                        <Box
                          bg="gradient-to-br from-yellow-300 to-yellow-500"
                          p={3}
                          borderRadius="xl"
                          minW="60px"
                          h="60px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          boxShadow="lg"
                        >
                          <Text fontSize="2xl">⭐</Text>
                        </Box>
                        <VStack align="start" gap={0.5}>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color="gray.800"
                          >
                            Nota 1
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Muito Ruim
                          </Text>
                        </VStack>
                      </HStack>
                      <Input
                        type="number"
                        min="0"
                        w="140px"
                        size="xl"
                        fontSize="24px"
                        textAlign="center"
                        fontWeight="bold"
                        color="gray.700"
                        borderWidth="2px"
                        _focus={{
                          borderColor: "purple.500",
                          shadow: "outline",
                        }}
                        value={metricasForm.countNota1}
                        onChange={(e) =>
                          setMetricasForm({
                            ...metricasForm,
                            countNota1: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </Flex>
                  </Box>
                </VStack>
              </Box>

              {/* Informação */}
              <Box
                bg="blue.50"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="blue.200"
              >
                <HStack gap={2}>
                  <Text fontSize="lg">💡</Text>
                  <Text fontSize="sm" color="blue.900">
                    As métricas serão calculadas automaticamente e a comissão
                    será definida com base nas regras configuradas no sistema.
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </DialogBody>

          <DialogFooter
            borderTop="1px solid"
            borderColor="gray.200"
            py={4}
            px={6}
            gap={3}
            flexShrink={0}
            bg="white"
            zIndex={1}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsMetricasDrawerOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              bg="purple.600"
              color="white"
              size="lg"
              _hover={{ bg: "purple.700" }}
              onClick={handleSaveMetricas}
              loading={savingMetricas}
            >
              Salvar Métricas
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
