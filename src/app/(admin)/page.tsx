'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  HStack,
  VStack,
  Flex,
  Icon,
  Badge,
  Heading,
  Card,
  Table,
  Avatar,
  Popover,
  Button,
} from '@chakra-ui/react';
import {
  CheckCircle2,
  Headphones,
  TrendingUp,
  Award,
  Users,
  Trophy,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { useFlipTheme } from '@/hooks/useFlipTheme';

type Funcionario = {
  id: string;
  nome: string;
  turno: string;
  status: string;
  setor?: { nome: string } | null;
  cargo?: string | null;
};

type MetricasMensais = {
  funcionarioId: string;
  countNota5: number;
  countNota4: number;
  countNota3: number;
  countNota2: number;
  countNota1: number;
  finalScore?: number | null;
  ValorComissao?: number | null;
};

type DashboardRow = {
  id: string;
  name: string;
  turno: string;
  atendimentos: number;
  pontuacao: number;
  maxPossivel: number;
  percentual: number;
  bonus: number;
  destaque?: boolean;
  atingiuMedia?: boolean;
};

const MONTHS_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function calcularBonus(percentual: number) {
  if (percentual >= 100) return 500;
  if (percentual >= 96) return 400;
  if (percentual >= 90) return 300;
  if (percentual >= 86) return 200;
  if (percentual >= 80) return 100;
  return 0;
}

export default function DashboardSupport() {
  const theme = useFlipTheme();
  const [referenceMonth, setReferenceMonth] = useState(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}`;
  });
  const [equipeMetrics, setEquipeMetrics] = useState<DashboardRow[]>([]);
  const [_loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  // Anos disponíveis
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
  }, []);

  const { month, year, referenceLabel } = useMemo(() => {
    const [y, m] = referenceMonth.split('-').map(Number);
    const safeMonth = Number.isFinite(m) ? m : new Date().getMonth() + 1;
    const safeYear = Number.isFinite(y) ? y : new Date().getFullYear();
    return {
      month: safeMonth,
      year: safeYear,
      referenceLabel: `${MONTHS_PT[safeMonth - 1] ?? 'Mês'}/${safeYear}`,
    };
  }, [referenceMonth]);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboard() {
      setLoading(true);
      setError(null);
      try {
        const [funcRes, metRes] = await Promise.all([
          fetch('/api/funcionarios'),
          fetch(`/api/metricas?month=${month}&year=${year}`),
        ]);

        if (!funcRes.ok || !metRes.ok) {
          throw new Error('Erro ao carregar dados do dashboard');
        }

        const funcionarios = (await funcRes.json()) as Funcionario[];
        const metricas = (await metRes.json()) as MetricasMensais[];

        const metricasMap = new Map(metricas.map((metrica) => [metrica.funcionarioId, metrica]));

        // Calcular média de atendimentos por setor/cargo
        const atendimentosPorSetor = new Map<string, number[]>();
        funcionarios.forEach((func) => {
          const metrica = metricasMap.get(func.id);
          if (metrica) {
            // Usa setor se existir, senão usa cargo como fallback
            const grupo = func.setor?.nome || func.cargo || 'Sem Classificação';
            if (!atendimentosPorSetor.has(grupo)) {
              atendimentosPorSetor.set(grupo, []);
            }
            const countNota5 = metrica.countNota5 ?? 0;
            const countNota4 = metrica.countNota4 ?? 0;
            const countNota3 = metrica.countNota3 ?? 0;
            const countNota2 = metrica.countNota2 ?? 0;
            const countNota1 = metrica.countNota1 ?? 0;
            const atendimentos = countNota5 + countNota4 + countNota3 + countNota2 + countNota1;
            atendimentosPorSetor.get(grupo)!.push(atendimentos);
          }
        });

        // Calcular médias por setor
        const mediaAtendimentosPorSetor = new Map<string, number>();
        atendimentosPorSetor.forEach((valores, setor) => {
          const media = valores.reduce((a, b) => a + b, 0) / valores.length || 0;
          mediaAtendimentosPorSetor.set(setor, media);
        });

        const rows = funcionarios
          .filter((f) => f.status !== 'INATIVO')
          .map((funcionario) => {
            const metrica = metricasMap.get(funcionario.id);
            const countNota5 = metrica?.countNota5 ?? 0;
            const countNota4 = metrica?.countNota4 ?? 0;
            const countNota3 = metrica?.countNota3 ?? 0;
            const countNota2 = metrica?.countNota2 ?? 0;
            const countNota1 = metrica?.countNota1 ?? 0;
            const atendimentos = countNota5 + countNota4 + countNota3 + countNota2 + countNota1;
            const pontuacao =
              countNota5 * 5 + countNota4 * 4 + countNota3 * 3 + countNota2 * 2 + countNota1 * 1;
            const maxPossivel = atendimentos * 5;
            const percentual = maxPossivel > 0 ? Math.round((pontuacao / maxPossivel) * 100) : 0;

            // Validação: precisa ter atendimentos >= média do setor/cargo
            const grupo = funcionario.setor?.nome || funcionario.cargo || 'Sem Classificação';
            const mediaGrupo = mediaAtendimentosPorSetor.get(grupo) || 0;
            const atendeMinimo = atendimentos >= mediaGrupo && mediaGrupo > 0;
            let bonus = 0;
            if (atendeMinimo && percentual >= 80) {
              bonus = calcularBonus(percentual);
            }

            return {
              id: funcionario.id,
              name: funcionario.nome,
              turno: funcionario.turno,
              atendimentos,
              pontuacao,
              maxPossivel,
              percentual,
              bonus,
              atingiuMedia: atendeMinimo,
            } satisfies DashboardRow;
          });

        if (isMounted) {
          setEquipeMetrics(rows);
        }
      } catch (fetchError) {
        console.error(fetchError);
        if (isMounted) {
          setError('Não foi possível carregar os dados do dashboard.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [month, year]);

  const equipeOrdenada = useMemo(
    () => [...equipeMetrics].sort((a, b) => b.percentual - a.percentual),
    [equipeMetrics],
  );

  const totalAtendimentos = useMemo(
    () => equipeMetrics.reduce((acc, curr) => acc + curr.atendimentos, 0),
    [equipeMetrics],
  );

  const totalBonus = useMemo(
    () => equipeMetrics.reduce((acc, curr) => acc + curr.bonus, 0),
    [equipeMetrics],
  );

  const mediaEquipe = useMemo(() => {
    if (equipeMetrics.length === 0) return 0;
    // Retorna a média de atendimentos (total de atendimentos / número de funcionários)
    return Math.round(
      equipeMetrics.reduce((acc, curr) => acc + curr.atendimentos, 0) / equipeMetrics.length,
    );
  }, [equipeMetrics]);

  const abaixoDaMeta = useMemo(
    () => equipeMetrics.filter((t) => t.percentual < 80).length,
    [equipeMetrics],
  );

  const acimaDe90 = useMemo(
    () => equipeMetrics.filter((t) => t.percentual >= 90).length,
    [equipeMetrics],
  );

  const percentualEquipe90 = useMemo(() => {
    if (equipeMetrics.length === 0) return 0;
    return Math.round((acimaDe90 / equipeMetrics.length) * 100);
  }, [acimaDe90, equipeMetrics.length]);

  return (
    <Box>
      <VStack gap={6} align="stretch">
        {/* HEADER AZUL SIMPLIFICADO */}
        <Box
          bg="linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)"
          p={6}
          borderRadius="xl"
          boxShadow="lg"
        >
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <HStack gap={4}>
              <Box bg="whiteAlpha.200" p={3} borderRadius="xl">
                <Icon as={Headphones} color="white" boxSize={6} />
              </Box>
              <Box>
                <Heading size="lg" color="white" fontWeight="bold">
                  Dashboard do Suporte Técnico
                </Heading>
                <Text color="whiteAlpha.800" fontSize="sm">
                  Para monitoramento das comissões da equipe
                </Text>
              </Box>
            </HStack>

            <Popover.Root
              positioning={{ placement: 'bottom-end' }}
              open={isMonthPickerOpen}
              onOpenChange={(details) => setIsMonthPickerOpen(details.open)}
            >
              <Popover.Trigger asChild>
                <HStack
                  bg="whiteAlpha.200"
                  px={4}
                  py={2}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  cursor="pointer"
                  _hover={{ bg: 'whiteAlpha.300' }}
                  transition="all 0.2s"
                >
                  <Icon as={Calendar} color="white" boxSize={4} />
                  <Text fontSize="xs" color="whiteAlpha.800" fontWeight="medium">
                    PERÍODO DE REFERÊNCIA
                  </Text>
                  <Badge bg="blue.400" color="white" px={3} py={1} borderRadius="md" fontSize="sm">
                    {referenceLabel}
                  </Badge>
                </HStack>
              </Popover.Trigger>

              <Popover.Positioner>
                <Popover.Content
                  bg={theme.bgCard}
                  borderRadius="xl"
                  boxShadow="2xl"
                  w="280px"
                  overflow="hidden"
                  border="1px solid"
                  borderColor={theme.borderColor}
                >
                  <Popover.Arrow />
                  <Popover.Body p={0}>
                    {/* Navegação de Ano */}
                    <Flex
                      justify="space-between"
                      align="center"
                      p={3}
                      bg={theme.bgSecondary}
                      borderBottom="1px solid"
                      borderColor={theme.borderLight}
                    >
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => setSelectedYear((prev) => prev - 1)}
                        disabled={!availableYears.includes(selectedYear - 1)}
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Text fontWeight="bold" fontSize="md" color={theme.textPrimary}>
                        {selectedYear}
                      </Text>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => setSelectedYear((prev) => prev + 1)}
                        disabled={!availableYears.includes(selectedYear + 1)}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </Flex>

                    {/* Grid de Meses */}
                    <SimpleGrid columns={3} gap={2} p={3}>
                      {MONTHS_PT.map((monthName, index) => {
                        const monthValue = `${selectedYear}-${String(index + 1).padStart(2, '0')}`;
                        const isSelected = referenceMonth === monthValue;
                        const isCurrentMonth =
                          new Date().getFullYear() === selectedYear &&
                          new Date().getMonth() === index;

                        return (
                          <Box
                            key={monthValue}
                            py={2}
                            px={1}
                            textAlign="center"
                            borderRadius="md"
                            cursor="pointer"
                            bg={isSelected ? theme.brandPrimary : 'transparent'}
                            color={isSelected ? 'white' : theme.textPrimary}
                            fontWeight={isSelected || isCurrentMonth ? 'bold' : 'normal'}
                            border={isCurrentMonth && !isSelected ? '2px solid' : 'none'}
                            borderColor={theme.brandPrimary}
                            _hover={{ bg: isSelected ? theme.brandHover : theme.bgHover }}
                            transition="all 0.15s"
                            onClick={() => {
                              setReferenceMonth(monthValue);
                              setIsMonthPickerOpen(false);
                            }}
                          >
                            <Text fontSize="xs">{monthName.slice(0, 3)}</Text>
                          </Box>
                        );
                      })}
                    </SimpleGrid>
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Popover.Root>
          </Flex>
          {error && (
            <Text fontSize="xs" color="red.200" mt={2}>
              {error}
            </Text>
          )}
        </Box>

        {/* CARDS DE ESTATÍSTICAS - SIMPLIFICADOS */}
        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
          <Card.Root
            bg={theme.bgCard}
            boxShadow="sm"
            borderRadius="lg"
            overflow="hidden"
            border="1px solid"
            borderColor={theme.borderColor}
          >
            <Box h="3px" bg={theme.brandPrimary} />
            <Card.Body p={5}>
              <Text fontSize="xs" color={theme.textMuted} fontWeight="semibold" mb={1}>
                TOTAL DE ATENDIMENTOS
              </Text>
              <Heading size="xl" color={theme.textPrimary}>
                {totalAtendimentos.toLocaleString()}
              </Heading>
              <Text fontSize="xs" color={theme.textMuted} mt={1}>
                OPA + Ligações
              </Text>
              <Box position="absolute" top={4} right={4}>
                <Box
                  bg={theme.colorMode === 'dark' ? 'blue.900' : 'blue.50'}
                  p={2}
                  borderRadius="lg"
                >
                  <Icon as={Headphones} color={theme.brandPrimary} boxSize={5} />
                </Box>
              </Box>
            </Card.Body>
          </Card.Root>

          <Card.Root
            bg={theme.bgCard}
            boxShadow="sm"
            borderRadius="lg"
            overflow="hidden"
            border="1px solid"
            borderColor={theme.borderColor}
          >
            <Box h="3px" bg="cyan.500" />
            <Card.Body p={5}>
              <Text fontSize="xs" color={theme.textMuted} fontWeight="semibold" mb={1}>
                MÉDIA POR COLABORADOR
              </Text>
              <Heading size="xl" color={theme.textPrimary}>
                {mediaEquipe}
              </Heading>
              <Text fontSize="xs" color={theme.textMuted} mt={1}>
                atendimentos/mês
              </Text>
              <Box position="absolute" top={4} right={4}>
                <Box
                  bg={theme.colorMode === 'dark' ? 'cyan.900' : 'cyan.50'}
                  p={2}
                  borderRadius="lg"
                >
                  <Icon as={TrendingUp} color="cyan.500" boxSize={5} />
                </Box>
              </Box>
            </Card.Body>
          </Card.Root>

          <Card.Root
            bg={theme.bgCard}
            boxShadow="sm"
            borderRadius="lg"
            overflow="hidden"
            border="1px solid"
            borderColor={theme.borderColor}
          >
            <Box h="3px" bg="orange.500" />
            <Card.Body p={5}>
              <Text fontSize="xs" color={theme.textMuted} fontWeight="semibold" mb={1}>
                EQUIPE ACIMA DE 90%
              </Text>
              <Heading size="xl" color={theme.textPrimary}>
                {percentualEquipe90}%
              </Heading>
              <Text fontSize="xs" color={theme.textMuted} mt={1}>
                {acimaDe90} de {equipeMetrics.length} técnicos
              </Text>
              <Box position="absolute" top={4} right={4}>
                <Box
                  bg={theme.colorMode === 'dark' ? 'orange.900' : 'orange.50'}
                  p={2}
                  borderRadius="lg"
                >
                  <Icon as={Users} color="orange.500" boxSize={5} />
                </Box>
              </Box>
            </Card.Body>
          </Card.Root>

          <Card.Root
            bg={theme.bgCard}
            boxShadow="sm"
            borderRadius="lg"
            overflow="hidden"
            border="1px solid"
            borderColor={theme.borderColor}
          >
            <Box h="3px" bg={theme.success} />
            <Card.Body p={5}>
              <Text fontSize="xs" color={theme.textMuted} fontWeight="semibold" mb={1}>
                TOTAL EM BÔNUS
              </Text>
              <Heading size="xl" color={theme.textPrimary}>
                R$ {totalBonus.toLocaleString('pt-BR')}
              </Heading>
              <Text fontSize="xs" color={theme.textMuted} mt={1}>
                a pagar este mês
              </Text>
              <Box position="absolute" top={4} right={4}>
                <Box
                  bg={theme.colorMode === 'dark' ? 'green.900' : 'green.50'}
                  p={2}
                  borderRadius="lg"
                >
                  <Icon as={Award} color={theme.success} boxSize={5} />
                </Box>
              </Box>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* GRÁFICO E TOP PERFORMERS */}
        <SimpleGrid columns={{ base: 1, lg: 4 }} gap={6}>
          {/* Gráfico de Barras Verticais */}
          <Box
            gridColumn={{ lg: 'span 3' }}
            bg={theme.bgCard}
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor={theme.borderColor}
          >
            <HStack mb={6}>
              <Icon as={TrendingUp} color={theme.textSecondary} boxSize={5} />
              <Heading size="md" color={theme.textPrimary}>
                Performance da Equipe
              </Heading>
            </HStack>

            <Box h="350px" w="full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={equipeOrdenada.map((item) => ({
                    ...item,
                    shortName: item.name.split(' ')[0],
                  }))}
                  margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.borderColor}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fontSize: 12, fill: theme.textMuted, fontWeight: 500 }}
                    tickLine={false}
                    axisLine={{ stroke: theme.borderColor }}
                    interval={0}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: theme.textMuted }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{
                      backgroundColor: theme.colorMode === 'dark' ? '#1e293b' : '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 14px',
                    }}
                    labelStyle={{ color: '#FFF', fontWeight: 'bold', marginBottom: '4px' }}
                    formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Performance']}
                  />
                  <ReferenceLine
                    y={80}
                    stroke={theme.textMuted}
                    strokeDasharray="5 5"
                    strokeWidth={1}
                  />
                  <Bar dataKey="percentual" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    {equipeOrdenada.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.percentual >= 90
                            ? '#22c55e'
                            : entry.percentual >= 80
                              ? '#eab308'
                              : '#ef4444'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* Top Performers */}
          <Box
            bg={theme.bgCard}
            p={6}
            borderRadius="xl"
            boxShadow="sm"
            border="1px solid"
            borderColor={theme.borderColor}
          >
            <HStack mb={5}>
              <Icon as={Trophy} color="yellow.500" boxSize={5} />
              <Heading size="md" color={theme.textPrimary}>
                Top Performers
              </Heading>
            </HStack>

            <VStack gap={4} align="stretch">
              {equipeOrdenada.slice(0, 5).map((row, index) => (
                <HStack
                  key={row.id}
                  justify="space-between"
                  p={2}
                  borderRadius="lg"
                  _hover={{ bg: theme.bgHover }}
                >
                  <HStack gap={3}>
                    <Avatar.Root
                      size="sm"
                      bg={
                        index === 0
                          ? 'yellow.400'
                          : index === 1
                            ? 'gray.400'
                            : index === 2
                              ? 'orange.400'
                              : theme.brandPrimary
                      }
                    >
                      <Avatar.Fallback color="white" fontWeight="bold" fontSize="xs">
                        {index + 1}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" color={theme.textPrimary}>
                        {row.name}
                      </Text>
                      <Text fontSize="xs" color={theme.textMuted}>
                        {row.atendimentos} atend.
                      </Text>
                    </Box>
                  </HStack>
                  <Badge
                    colorPalette={
                      row.percentual >= 90 ? 'green' : row.percentual >= 80 ? 'yellow' : 'red'
                    }
                    variant="solid"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                  >
                    {row.percentual}%
                  </Badge>
                </HStack>
              ))}
            </VStack>

            {abaixoDaMeta > 0 && (
              <Box mt={4} pt={4} borderTop="1px solid" borderColor={theme.borderLight}>
                <Text fontSize="xs" color={theme.textMuted}>
                  ⚠️ {abaixoDaMeta} abaixo da meta
                </Text>
              </Box>
            )}
          </Box>
        </SimpleGrid>

        {/* TABELA RANKING COMPLETO */}
        <Box
          bg={theme.bgCard}
          p={6}
          borderRadius="xl"
          boxShadow="sm"
          overflowX="auto"
          border="1px solid"
          borderColor={theme.borderColor}
        >
          <HStack mb={6}>
            <Icon as={Award} color={theme.brandPrimary} boxSize={5} />
            <Heading size="md" color={theme.textPrimary}>
              Ranking Completo da Equipe
            </Heading>
          </HStack>

          <Table.Root size="sm">
            <Table.Header>
              <Table.Row bg={theme.bgSecondary}>
                <Table.ColumnHeader fontWeight="semibold" color={theme.textSecondary} w="50px">
                  #
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="semibold" color={theme.textSecondary}>
                  Colaborador
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  textAlign="center"
                  fontWeight="semibold"
                  color={theme.textSecondary}
                >
                  Atendimentos
                </Table.ColumnHeader>
                <Table.ColumnHeader fontWeight="semibold" color={theme.textSecondary} w="300px">
                  Performance
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  textAlign="center"
                  fontWeight="semibold"
                  color={theme.textSecondary}
                >
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  textAlign="end"
                  fontWeight="semibold"
                  color={theme.textSecondary}
                >
                  Bônus
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {equipeOrdenada.map((row, index) => {
                const isEligible = row.atingiuMedia && row.percentual >= 80;
                const barColor =
                  row.percentual >= 90
                    ? 'green.400'
                    : row.percentual >= 80
                      ? 'yellow.400'
                      : 'red.400';

                return (
                  <Table.Row key={row.id} _hover={{ bg: theme.bgHover }}>
                    <Table.Cell fontWeight="medium" color={theme.textMuted}>
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell>
                      <HStack gap={3}>
                        <Avatar.Root size="sm" bg={theme.brandPrimary}>
                          <Avatar.Fallback color="white" fontWeight="bold" fontSize="xs">
                            {row.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <Box>
                          <Text fontWeight="medium" color={theme.textPrimary}>
                            {row.name}
                          </Text>
                          <Text fontSize="xs" color={theme.textMuted}>
                            Turno {row.turno}
                          </Text>
                        </Box>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell textAlign="center" fontWeight="medium" color={theme.textSecondary}>
                      {row.atendimentos}
                    </Table.Cell>
                    <Table.Cell>
                      <HStack gap={3}>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color={theme.textPrimary}
                          w="45px"
                        >
                          {row.percentual}%
                        </Text>
                        <Box
                          flex={1}
                          h="10px"
                          bg={theme.bgSecondary}
                          borderRadius="full"
                          overflow="hidden"
                        >
                          <Box
                            h="100%"
                            w={`${row.percentual}%`}
                            bg={barColor}
                            borderRadius="full"
                            transition="width 0.3s"
                          />
                        </Box>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Badge
                        colorPalette={isEligible ? 'green' : 'red'}
                        variant="subtle"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                      >
                        <HStack gap={1}>
                          <Icon as={CheckCircle2} boxSize={3} />
                          <Text>{isEligible ? 'Qualificado' : 'Abaixo da meta'}</Text>
                        </HStack>
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <Text
                        fontWeight="bold"
                        fontSize="sm"
                        color={row.bonus > 0 ? theme.success : theme.textMuted}
                      >
                        {row.bonus > 0 ? `R$ ${row.bonus}` : 'R$ 0'}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Box>
      </VStack>
    </Box>
  );
}
