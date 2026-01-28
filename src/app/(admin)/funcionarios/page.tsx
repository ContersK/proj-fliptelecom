'use client';

import { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { Plus, Search, Edit2, Trash2, UserCheck, UserX, BarChart3 } from 'lucide-react';
import { useFlipTheme } from '@/hooks/useFlipTheme';

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
  const theme = useFlipTheme();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMetricasDrawerOpen, setIsMetricasDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado do Formulário
  const [formData, setFormData] = useState<Partial<Funcionario>>({
    nome: '',
    email: '',
    cargo: 'Suporte N1',
    turno: 'A',
    status: 'ATIVO',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Estado do Formulário de Métricas
  const [metricasForm, setMetricasForm] = useState<MetricasForm>({
    funcionarioId: '',
    funcionarioNome: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    countNota5: 0,
    countNota4: 0,
    countNota3: 0,
    countNota2: 0,
    countNota1: 0,
  });
  const [savingMetricas, setSavingMetricas] = useState(false);
  const [loadingMetricas, setLoadingMetricas] = useState(false);
  const [isPeriodoClosed, setIsPeriodoClosed] = useState(false);

  // Função para verificar se o período está fechado
  async function checkPeriodoFechado(funcionarioId: string, month: number, year: number) {
    try {
      const res = await fetch(
        `/api/periodo-status?funcionarioId=${funcionarioId}&month=${month}&year=${year}`,
      );
      const data = await res.json();
      setIsPeriodoClosed(data.isClosed || false);
    } catch (error) {
      console.error('Erro ao verificar status do período:', error);
      setIsPeriodoClosed(false);
    }
  }

  // Função para buscar métricas existentes
  async function fetchMetricasExistentes(funcionarioId: string, month: number, year: number) {
    setLoadingMetricas(true);
    try {
      // Busca métricas e status do período em paralelo
      const [metricasRes, periodoRes] = await Promise.all([
        fetch(`/api/metricas?funcionarioId=${funcionarioId}&month=${month}&year=${year}`),
        fetch(`/api/periodo-status?funcionarioId=${funcionarioId}&month=${month}&year=${year}`),
      ]);

      const data = await metricasRes.json();
      const periodoData = await periodoRes.json();

      setIsPeriodoClosed(periodoData.isClosed || false);

      if (data && data.length > 0) {
        const metrica = data[0];
        setMetricasForm((prev) => ({
          ...prev,
          countNota5: metrica.countNota5 || 0,
          countNota4: metrica.countNota4 || 0,
          countNota3: metrica.countNota3 || 0,
          countNota2: metrica.countNota2 || 0,
          countNota1: metrica.countNota1 || 0,
        }));
      } else {
        // Sem métricas para esse período, zera os campos
        setMetricasForm((prev) => ({
          ...prev,
          countNota5: 0,
          countNota4: 0,
          countNota3: 0,
          countNota2: 0,
          countNota1: 0,
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar métricas existentes:', error);
    } finally {
      setLoadingMetricas(false);
    }
  }

  // Efeito para recarregar métricas quando mês/ano mudar
  useEffect(() => {
    if (isMetricasDrawerOpen && metricasForm.funcionarioId) {
      fetchMetricasExistentes(metricasForm.funcionarioId, metricasForm.month, metricasForm.year);
    }
  }, [metricasForm.month, metricasForm.year, isMetricasDrawerOpen, metricasForm.funcionarioId]);

  // 1. CARREGAR DADOS DO BANCO
  async function fetchFuncionarios() {
    setLoading(true);
    try {
      const res = await fetch('/api/funcionarios');
      const data = await res.json();
      setFuncionarios(data);
    } catch (error) {
      console.error('Erro ao buscar', error);
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
        nome: '',
        email: '',
        cargo: 'Suporte N1',
        turno: 'A',
        status: 'ATIVO',
      });
    }
    setIsDrawerOpen(true);
  }

  // 3. SALVAR (CREATE ou UPDATE)
  async function handleSave() {
    if (!formData.nome || !formData.turno) return alert('Preencha os campos obrigatórios');

    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/funcionarios/${editingId}` : '/api/funcionarios';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erro ao salvar');

      await fetchFuncionarios(); // Atualiza a lista
      setIsDrawerOpen(false); // Fecha a gaveta
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      alert('Erro ao salvar funcionário');
    } finally {
      setSaving(false);
    }
  }

  // 4. DELETAR
  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      await fetch(`/api/funcionarios/${id}`, { method: 'DELETE' });
      fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao deletar funcionário:', error);
      alert('Erro ao deletar');
    }
  }

  // 5. ABRIR MODAL DE MÉTRICAS
  async function handleOpenMetricas(funcionario: Funcionario) {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    setMetricasForm({
      funcionarioId: funcionario.id,
      funcionarioNome: funcionario.nome,
      month: currentMonth,
      year: currentYear,
      countNota5: 0,
      countNota4: 0,
      countNota3: 0,
      countNota2: 0,
      countNota1: 0,
    });
    setIsMetricasDrawerOpen(true);

    // Busca as métricas existentes para o período atual
    await fetchMetricasExistentes(funcionario.id, currentMonth, currentYear);
  }

  // 6. SALVAR MÉTRICAS
  async function handleSaveMetricas() {
    setSavingMetricas(true);
    try {
      const res = await fetch('/api/metricas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      if (!res.ok) throw new Error('Erro ao salvar métricas');

      alert('Métricas salvas com sucesso!');
      setIsMetricasDrawerOpen(false);
    } catch (error) {
      console.error('Erro ao salvar métricas:', error);
      alert('Erro ao salvar métricas');
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
          <Heading size="lg" color={theme.textPrimary}>
            Equipe
          </Heading>
          <Text color={theme.textSecondary} fontSize="sm">
            Gerencie seus colaboradores
          </Text>
        </Box>
        <Button
          onClick={() => handleOpenDrawer()}
          bg={theme.brandPrimary}
          color="white"
          _hover={{ bg: theme.brandHover }}
          size="sm"
        >
          <Plus size={18} style={{ marginRight: 8 }} />
          Novo Funcionário
        </Button>
      </Flex>

      {/* BARRA DE FILTROS */}
      <Box
        bg={theme.bgCard}
        p={4}
        borderRadius="xl"
        boxShadow="sm"
        mb={6}
        border="1px solid"
        borderColor={theme.borderColor}
      >
        <HStack>
          <Box position="relative" w="300px">
            <Input
              placeholder="Buscar por nome..."
              ps={10}
              bg={theme.bgInput}
              border="1px solid"
              borderColor={theme.borderColor}
              color={theme.textPrimary}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              _placeholder={{ color: theme.textMuted }}
            />
            <Box
              position="absolute"
              left={3}
              top="50%"
              transform="translateY(-50%)"
              color={theme.textMuted}
              pointerEvents="none"
            >
              <Search size={18} />
            </Box>
          </Box>
        </HStack>
      </Box>

      {/* TABELA DE FUNCIONÁRIOS */}
      <Box
        bg={theme.bgCard}
        borderRadius="xl"
        boxShadow="sm"
        overflow="hidden"
        border="1px solid"
        borderColor={theme.borderColor}
      >
        {loading ? (
          <Flex p={10} justify="center">
            <Spinner color={theme.brandPrimary} />
          </Flex>
        ) : (
          <Table.Root size="md" interactive>
            <Table.Header bg={theme.bgSecondary}>
              <Table.Row>
                <Table.ColumnHeader pl={6} color={theme.textSecondary}>
                  Colaborador
                </Table.ColumnHeader>
                <Table.ColumnHeader color={theme.textSecondary}>Cargo</Table.ColumnHeader>
                <Table.ColumnHeader color={theme.textSecondary}>Turno</Table.ColumnHeader>
                <Table.ColumnHeader color={theme.textSecondary}>Status</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end" pr={6} color={theme.textSecondary}>
                  Ações
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((func) => (
                <Table.Row key={func.id} _hover={{ bg: theme.bgHover }}>
                  <Table.Cell pl={6}>
                    <HStack gap={3}>
                      <Avatar.Root
                        size="sm"
                        bg={theme.colorMode === 'dark' ? 'blue.800' : 'blue.100'}
                        color={theme.colorMode === 'dark' ? 'blue.200' : 'blue.700'}
                      >
                        <Avatar.Fallback>{func.nome.substring(0, 2).toUpperCase()}</Avatar.Fallback>
                      </Avatar.Root>
                      <Box>
                        <Text fontWeight="medium" color={theme.textPrimary}>
                          {func.nome}
                        </Text>
                        <Text fontSize="xs" color={theme.textMuted}>
                          {func.email || 'Sem email'}
                        </Text>
                      </Box>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell color={theme.textSecondary}>{func.cargo}</Table.Cell>
                  <Table.Cell>
                    <Badge variant="subtle" colorPalette="blue">
                      {func.turno}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant="solid"
                      colorPalette={func.status === 'ATIVO' ? 'green' : 'red'}
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
                        _hover={{
                          color: 'purple.600',
                          bg: theme.colorMode === 'dark' ? 'purple.900' : 'purple.50',
                        }}
                        onClick={() => handleOpenMetricas(func)}
                      >
                        <BarChart3 size={16} />
                      </IconButton>
                      <IconButton
                        aria-label="Editar"
                        variant="ghost"
                        size="sm"
                        color={theme.textMuted}
                        onClick={() => handleOpenDrawer(func)}
                      >
                        <Edit2 size={16} />
                      </IconButton>
                      <IconButton
                        aria-label="Excluir"
                        variant="ghost"
                        size="sm"
                        color="red.400"
                        _hover={{
                          color: 'red.600',
                          bg: theme.colorMode === 'dark' ? 'red.900' : 'red.50',
                        }}
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
      <Drawer.Root open={isDrawerOpen} onOpenChange={(e) => setIsDrawerOpen(e.open)}>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg={theme.bgCard}>
            <Drawer.Header borderBottom="1px solid" borderColor={theme.borderColor} pb={4}>
              <Drawer.Title color={theme.textPrimary}>
                {editingId ? 'Editar Funcionário' : 'Novo Colaborador'}
              </Drawer.Title>
              <Drawer.CloseTrigger />
            </Drawer.Header>

            <Drawer.Body py={6}>
              <VStack gap={5} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1} color={theme.textSecondary}>
                    Nome Completo
                  </Text>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Rafael Alencar"
                    bg={theme.bgInput}
                    color={theme.textPrimary}
                    borderColor={theme.borderColor}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1} color={theme.textSecondary}>
                    Email Corporativo
                  </Text>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@flip.com"
                    bg={theme.bgInput}
                    color={theme.textPrimary}
                    borderColor={theme.borderColor}
                  />
                </Box>

                <HStack gap={4}>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" mb={1} color={theme.textSecondary}>
                      Turno
                    </Text>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: `1px solid ${theme.borderColor}`,
                        backgroundColor: theme.bgInput,
                        color: theme.textPrimary,
                      }}
                      value={formData.turno}
                      onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                    >
                      <option value="A">Turno A</option>
                      <option value="B">Turno B</option>
                      <option value="C">Turno C</option>
                      <option value="COMERCIAL">Comercial</option>
                    </select>
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" mb={1} color={theme.textSecondary}>
                      Cargo
                    </Text>
                    <Input
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      bg={theme.bgInput}
                      color={theme.textPrimary}
                      borderColor={theme.borderColor}
                    />
                  </Box>
                </HStack>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1} color={theme.textSecondary}>
                    Status
                  </Text>
                  <HStack gap={3}>
                    <Button
                      size="sm"
                      variant={formData.status === 'ATIVO' ? 'solid' : 'outline'}
                      colorPalette="green"
                      onClick={() => setFormData({ ...formData, status: 'ATIVO' })}
                    >
                      <UserCheck size={16} style={{ marginRight: 4 }} /> Ativo
                    </Button>
                    <Button
                      size="sm"
                      variant={formData.status === 'INATIVO' ? 'solid' : 'outline'}
                      colorPalette="red"
                      onClick={() => setFormData({ ...formData, status: 'INATIVO' })}
                    >
                      <UserX size={16} style={{ marginRight: 4 }} /> Inativo
                    </Button>
                  </HStack>
                </Box>
              </VStack>
            </Drawer.Body>

            <Drawer.Footer borderTop="1px solid" borderColor={theme.borderColor} pt={4}>
              <Button variant="outline" mr={3} onClick={() => setIsDrawerOpen(false)}>
                Cancelar
              </Button>
              <Button bg={theme.brandPrimary} color="white" onClick={handleSave} loading={saving}>
                {editingId ? 'Salvar Alterações' : 'Cadastrar'}
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>

      {/* --- MODAL DE REGISTRO DE MÉTRICAS/NOTAS --- */}
      <DialogRoot open={isMetricasDrawerOpen} onOpenChange={(e) => setIsMetricasDrawerOpen(e.open)}>
        <DialogBackdrop bg="blackAlpha.600" />
        <DialogContent
          maxW="750px"
          maxH={{ base: '90vh', md: '85vh' }}
          h="auto"
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          my="auto"
          bg={theme.bgCard}
        >
          <DialogHeader
            borderBottom="1px solid"
            borderColor={theme.borderColor}
            py={4}
            px={6}
            flexShrink={0}
            bg={theme.bgCard}
            zIndex={1}
          >
            <DialogTitle fontSize="xl" fontWeight="bold" color={theme.textPrimary}>
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
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: theme.bgSecondary,
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.textMuted,
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: theme.textSecondary,
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
                  color={theme.textSecondary}
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Período de Referência
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <Text fontSize="sm" mb={2} fontWeight="medium" color={theme.textSecondary}>
                      Mês
                    </Text>
                    <select
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '15px',
                        borderRadius: '8px',
                        border: `2px solid ${theme.borderColor}`,
                        backgroundColor: theme.bgInput,
                        color: theme.textPrimary,
                        cursor: 'pointer',
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
                          {new Date(2000, m - 1).toLocaleDateString('pt-BR', {
                            month: 'long',
                          })}
                        </option>
                      ))}
                    </select>
                  </Box>
                  <Box>
                    <Text fontSize="sm" mb={2} fontWeight="medium" color={theme.textSecondary}>
                      Ano
                    </Text>
                    <Input
                      type="number"
                      size="lg"
                      fontSize="15px"
                      value={metricasForm.year}
                      bg={theme.bgInput}
                      color={theme.textPrimary}
                      borderColor={theme.borderColor}
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
                <HStack justify="space-between" mb={3}>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color={theme.textSecondary}
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Quantidade de Avaliações por Nota
                  </Text>
                  {loadingMetricas && (
                    <HStack gap={2}>
                      <Spinner size="sm" color={theme.brandPrimary} />
                      <Text fontSize="xs" color={theme.textMuted}>
                        Carregando...
                      </Text>
                    </HStack>
                  )}
                </HStack>

                {isPeriodoClosed && !loadingMetricas && (
                  <Box
                    bg="orange.100"
                    border="1px solid"
                    borderColor="orange.300"
                    borderRadius="md"
                    p={3}
                    mb={3}
                  >
                    <Text fontSize="sm" color="orange.800" fontWeight="medium">
                      🔒 Este período já foi fechado. As notas não podem ser alteradas.
                    </Text>
                  </Box>
                )}

                <VStack
                  gap={3}
                  align="stretch"
                  opacity={loadingMetricas || isPeriodoClosed ? 0.6 : 1}
                >
                  {/* Nota 5 */}
                  <Box
                    bg={theme.bgSecondary}
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={theme.borderColor}
                    transition="all 0.2s"
                    _hover={{ borderColor: theme.brandPrimary, shadow: 'md' }}
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
                          <Text fontWeight="bold" fontSize="lg" color={theme.textPrimary}>
                            Nota 5
                          </Text>
                          <Text fontSize="sm" color={theme.textMuted}>
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
                        color={theme.textPrimary}
                        bg={theme.bgInput}
                        borderWidth="2px"
                        borderColor={theme.borderColor}
                        _focus={{
                          borderColor: theme.brandPrimary,
                          shadow: 'outline',
                        }}
                        value={metricasForm.countNota5}
                        disabled={isPeriodoClosed}
                        readOnly={isPeriodoClosed}
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
                    bg={theme.bgSecondary}
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={theme.borderColor}
                    transition="all 0.2s"
                    _hover={{ borderColor: theme.brandPrimary, shadow: 'md' }}
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
                          <Text fontWeight="bold" fontSize="lg" color={theme.textPrimary}>
                            Nota 4
                          </Text>
                          <Text fontSize="sm" color={theme.textMuted}>
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
                        color={theme.textPrimary}
                        bg={theme.bgInput}
                        borderWidth="2px"
                        borderColor={theme.borderColor}
                        _focus={{
                          borderColor: theme.brandPrimary,
                          shadow: 'outline',
                        }}
                        value={metricasForm.countNota4}
                        disabled={isPeriodoClosed}
                        readOnly={isPeriodoClosed}
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
                    bg={theme.bgSecondary}
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={theme.borderColor}
                    transition="all 0.2s"
                    _hover={{ borderColor: theme.brandPrimary, shadow: 'md' }}
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
                          <Text fontWeight="bold" fontSize="lg" color={theme.textPrimary}>
                            Nota 3
                          </Text>
                          <Text fontSize="sm" color={theme.textMuted}>
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
                        color={theme.textPrimary}
                        bg={theme.bgInput}
                        borderWidth="2px"
                        borderColor={theme.borderColor}
                        _focus={{
                          borderColor: theme.brandPrimary,
                          shadow: 'outline',
                        }}
                        value={metricasForm.countNota3}
                        disabled={isPeriodoClosed}
                        readOnly={isPeriodoClosed}
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
                    bg={theme.bgSecondary}
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={theme.borderColor}
                    transition="all 0.2s"
                    _hover={{ borderColor: theme.brandPrimary, shadow: 'md' }}
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
                          <Text fontWeight="bold" fontSize="lg" color={theme.textPrimary}>
                            Nota 2
                          </Text>
                          <Text fontSize="sm" color={theme.textMuted}>
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
                        color={theme.textPrimary}
                        bg={theme.bgInput}
                        borderWidth="2px"
                        borderColor={theme.borderColor}
                        _focus={{
                          borderColor: theme.brandPrimary,
                          shadow: 'outline',
                        }}
                        value={metricasForm.countNota2}
                        disabled={isPeriodoClosed}
                        readOnly={isPeriodoClosed}
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
                    bg={theme.bgSecondary}
                    p={4}
                    borderRadius="lg"
                    border="2px solid"
                    borderColor={theme.borderColor}
                    transition="all 0.2s"
                    _hover={{ borderColor: theme.brandPrimary, shadow: 'md' }}
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
                          <Text fontWeight="bold" fontSize="lg" color={theme.textPrimary}>
                            Nota 1
                          </Text>
                          <Text fontSize="sm" color={theme.textMuted}>
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
                        color={theme.textPrimary}
                        bg={theme.bgInput}
                        borderWidth="2px"
                        borderColor={theme.borderColor}
                        _focus={{
                          borderColor: theme.brandPrimary,
                          shadow: 'outline',
                        }}
                        value={metricasForm.countNota1}
                        disabled={isPeriodoClosed}
                        readOnly={isPeriodoClosed}
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
                bg={theme.colorMode === 'dark' ? 'blue.900' : 'blue.50'}
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor={theme.colorMode === 'dark' ? 'blue.700' : 'blue.200'}
              >
                <HStack gap={2}>
                  <Text fontSize="lg">💡</Text>
                  <Text fontSize="sm" color={theme.colorMode === 'dark' ? 'blue.100' : 'blue.900'}>
                    As métricas serão calculadas automaticamente e a comissão será definida com base
                    nas regras configuradas no sistema.
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </DialogBody>

          <DialogFooter
            borderTop="1px solid"
            borderColor={theme.borderColor}
            py={4}
            px={6}
            gap={3}
            flexShrink={0}
            bg={theme.bgCard}
            zIndex={1}
          >
            <Button
              variant="outline"
              size="lg"
              borderColor={theme.borderColor}
              color={theme.textPrimary}
              onClick={() => setIsMetricasDrawerOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              bg={isPeriodoClosed ? 'gray.400' : theme.brandPrimary}
              color="white"
              size="lg"
              _hover={{ bg: isPeriodoClosed ? 'gray.400' : theme.brandHover }}
              onClick={handleSaveMetricas}
              loading={savingMetricas}
              disabled={isPeriodoClosed}
            >
              {isPeriodoClosed ? 'Período Fechado' : 'Salvar Métricas'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
