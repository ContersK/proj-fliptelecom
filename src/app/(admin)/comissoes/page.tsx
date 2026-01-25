'use client';

import React, { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  chakra,
  SimpleGrid,
  Table,
  Text,
  VStack,
  Badge,
  Card,
} from '@chakra-ui/react';
import {
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type ComissaoRow = {
  id: string;
  name: string;
  setor: string;
  turno: string;
  atendimentos: number;
  pontuacao: number;
  maxPossivel: number;
  percentual: number;
  bonus: number;
  status: 'PENDENTE' | 'APROVADO' | 'REPROVADO';
  mediaMinima: number;
};

const MESES = [
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

export default function ComissoesPage() {
  const currentDate = new Date();
  const [referenceMonth, setReferenceMonth] = useState(() => {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${currentDate.getFullYear()}-${month}`;
  });
  const [comissaoData, setComissaoData] = useState<ComissaoRow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [setorFilter, setSetorFilter] = useState('todos');
  const [turnoFilter, setTurnoFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [closingPeriod, setClosingPeriod] = useState(false);
  const [userSetorId, setUserSetorId] = useState<string | null>(null);

  const { month, year, referenceLabel } = useMemo(() => {
    const [y, m] = referenceMonth.split('-').map(Number);
    const safeMonth = Number.isFinite(m) ? m : new Date().getMonth() + 1;
    const safeYear = Number.isFinite(y) ? y : new Date().getFullYear();
    return {
      month: safeMonth,
      year: safeYear,
      referenceLabel: `${MESES[safeMonth - 1] ?? 'Mês'}/${safeYear}`,
    };
  }, [referenceMonth]);

  useEffect(() => {
    let isMounted = true;

    async function fetchComissoes() {
      try {
        // Busca dados de funcionários com filtro por mês/ano
        const funcionariosRes = await fetch('/api/funcionarios');
        const funcionarios = (await funcionariosRes.json()) as Array<{
          id: string;
          nome?: string;
          name?: string;
          setor?: { nome: string; name?: string };
          cargo?: string;
          turno?: string;
        }>;

        // Busca dados de métricas com filtro por mês/ano
        const metricasRes = await fetch(`/api/metricas?month=${month}&year=${year}`);
        const metricasData = (await metricasRes.json()) as Array<{
          funcionarioId: string;
          countNota5?: number;
          countNota4?: number;
          countNota3?: number;
          countNota2?: number;
          countNota1?: number;
          funcionario?: {
            id: string;
            nome: string;
            setor?: { id: string; name: string } | null;
          };
        }>;

        // Calcular média de atendimentos por setor/cargo (arredondada para baixo)
        const atendimenrosPorSetor = new Map<string, number[]>();
        metricasData.forEach((metrica) => {
          const func = funcionarios.find((f) => f.id === metrica.funcionarioId);
          // Usa setor se existir, senão usa cargo, senão "Sem Classificação"
          const setorNome =
            metrica.funcionario?.setor?.name ||
            func?.setor?.nome ||
            func?.setor?.name ||
            func?.cargo ||
            'Sem Classificação';
          if (!atendimenrosPorSetor.has(setorNome)) {
            atendimenrosPorSetor.set(setorNome, []);
          }
          const countNota5 = metrica.countNota5 || 0;
          const countNota4 = metrica.countNota4 || 0;
          const countNota3 = metrica.countNota3 || 0;
          const countNota2 = metrica.countNota2 || 0;
          const countNota1 = metrica.countNota1 || 0;
          const atendimentos = countNota5 + countNota4 + countNota3 + countNota2 + countNota1;
          atendimenrosPorSetor.get(setorNome)!.push(atendimentos);
        });

        // Calcular médias por setor (arredondadas para baixo)
        const mediaAtendimentosPorSetor = new Map<string, number>();
        atendimenrosPorSetor.forEach((valores, setor) => {
          const media = Math.floor(valores.reduce((a, b) => a + b, 0) / valores.length || 0);
          mediaAtendimentosPorSetor.set(setor, media);
        });

        // Mapear dados para formato de comissão
        const rows: ComissaoRow[] = metricasData
          .map((metrica) => {
            const func = funcionarios.find((f) => f.id === metrica.funcionarioId);
            if (!func) return null;

            // Calcular atendimentos e pontuação
            const countNota5 = metrica.countNota5 || 0;
            const countNota4 = metrica.countNota4 || 0;
            const countNota3 = metrica.countNota3 || 0;
            const countNota2 = metrica.countNota2 || 0;
            const countNota1 = metrica.countNota1 || 0;
            const atendimentos = countNota5 + countNota4 + countNota3 + countNota2 + countNota1;
            const pontuacao =
              countNota5 * 5 + countNota4 * 4 + countNota3 * 3 + countNota2 * 2 + countNota1 * 1;
            const maxPossivel = atendimentos * 5;
            const percentual = maxPossivel > 0 ? Math.round((pontuacao / maxPossivel) * 100) : 0;

            // Obter setor nome (prioriza setor real, depois cargo como fallback)
            const setorNome =
              metrica.funcionario?.setor?.name ||
              func.setor?.nome ||
              func.setor?.name ||
              func.cargo ||
              'Sem Classificação';

            // Obter média mínima do setor
            const mediaSetor = mediaAtendimentosPorSetor.get(setorNome) || 0;

            // Determinar se está apto à bonificação
            // Precisa ter PELO MENOS a média de atendimentos do setor
            const atendeMinimo = atendimentos >= mediaSetor && mediaSetor > 0;

            // Calcular status e bônus
            let status: 'PENDENTE' | 'APROVADO' | 'REPROVADO' = 'REPROVADO';
            let bonus = 0;

            if (atendeMinimo) {
              // Se atingiu a média de atendimentos, está aprovado (mas pendente de fechamento)
              status = 'PENDENTE';
              bonus = calcularBonus(percentual);
            }

            return {
              id: func.id,
              name: func.nome || func.name || 'N/A',
              setor: setorNome,
              turno: func.turno || 'A',
              atendimentos,
              pontuacao,
              maxPossivel,
              percentual,
              bonus,
              status,
              mediaMinima: mediaSetor,
            } satisfies ComissaoRow;
          })
          .filter((row) => row !== null) as ComissaoRow[];

        if (isMounted) {
          setComissaoData(rows);
        }
      } catch (fetchError) {
        console.error(fetchError);
        if (isMounted) {
          console.error('Não foi possível carregar os dados de comissões.');
        }
      }
    }

    fetchComissoes();

    return () => {
      isMounted = false;
    };
  }, [month, year]);

  // Buscar setorId do supervisor na inicialização
  useEffect(() => {
    async function fetchUserSetor() {
      try {
        const res = await fetch('/api/usuarios/me');
        if (res.ok) {
          const user = await res.json();
          setUserSetorId(user.setor?.id || null);
        }
      } catch (err) {
        console.error('Erro ao buscar setor do usuário:', err);
      }
    }
    fetchUserSetor();
  }, []);

  // Função para fechar o período
  const handleClosePeriod = async () => {
    if (!userSetorId) {
      alert('Erro: Setor do supervisor não encontrado');
      return;
    }

    if (
      !window.confirm(
        `Tem certeza que deseja fechar o período de ${referenceLabel}? Esta ação é irreversível e todos os status serão finalizados.`,
      )
    ) {
      return;
    }

    setClosingPeriod(true);
    try {
      const res = await fetch('/api/comissoes/fechar-periodo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month,
          year,
          setorId: userSetorId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao fechar período');
      }

      const data = await res.json();
      alert(`Período fechado com sucesso!\nMédia de atendimentos: ${data.mediaAtendimentos}`);

      // Recarregar dados para refletir as mudanças
      window.location.reload();
    } catch (err) {
      alert(`Erro ao fechar período: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
      console.error(err);
    } finally {
      setClosingPeriod(false);
    }
  };

  // Navegar entre meses
  const handlePreviousMonth = () => {
    const [y, m] = referenceMonth.split('-').map(Number);
    let newMonth = m - 1;
    let newYear = y;

    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setReferenceMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [y, m] = referenceMonth.split('-').map(Number);
    let newMonth = m + 1;
    let newYear = y;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    setReferenceMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  // Filtrar dados
  const filteredData = comissaoData.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSetor = setorFilter === 'todos' || item.setor === setorFilter;
    const matchTurno = turnoFilter === 'todos' || item.turno === turnoFilter;
    const matchStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'aprovado' && item.status === 'APROVADO') ||
      (statusFilter === 'reprovado' && item.status === 'REPROVADO') ||
      (statusFilter === 'pendente' && item.status === 'PENDENTE');
    return matchSearch && matchSetor && matchTurno && matchStatus;
  });

  // Cálculos
  const totalPagar = filteredData.reduce((acc, curr) => acc + curr.bonus, 0);
  const aprovados = filteredData.filter((i) => i.status === 'APROVADO').length;
  const mediaPercentual = Math.round(
    filteredData.reduce((acc, curr) => acc + curr.percentual, 0) / (filteredData.length || 1),
  );

  const setores = Array.from(new Set(comissaoData.map((item) => item.setor))).filter(Boolean);
  const turnos = Array.from(new Set(comissaoData.map((item) => item.turno))).filter(Boolean);

  return (
    <Box>
      <VStack gap={8} align="stretch">
        {/* Cabeçalho */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" color="gray.700">
              Gestão de Comissões
            </Heading>
            <Text color="gray.500" fontSize="sm" mt={1}>
              Controle e acompanhamento de pagamentos
            </Text>
          </Box>
          <HStack gap={3}>
            <Button variant="outline" colorScheme="blue" size="md">
              <Icon as={Download} boxSize={4} mr={2} />
              Exportar
            </Button>
            <Button
              colorScheme="purple"
              size="md"
              onClick={handleClosePeriod}
              disabled={closingPeriod}
            >
              <Icon as={Calendar} boxSize={4} mr={2} />
              {closingPeriod ? 'Fechando...' : 'Fechar Período'}
            </Button>
          </HStack>
        </Flex>

        {/* Cards de Resumo */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          <Card.Root
            bg="white"
            boxShadow="lg"
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
          >
            <Box h="4px" bg="linear-gradient(90deg, #48bb78 0%, #38a169 100%)" />
            <Card.Body p={6}>
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    TOTAL A PAGAR
                  </Text>
                  <Heading size="2xl" color="gray.800" mt={2}>
                    R$ {totalPagar.toLocaleString()}
                  </Heading>
                </Box>
                <Box bg="green.50" p={3} borderRadius="xl">
                  <Icon as={DollarSign} color="green.600" boxSize={7} />
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>

          <Card.Root
            bg="white"
            boxShadow="lg"
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
          >
            <Box h="4px" bg="linear-gradient(90deg, #4299e1 0%, #3182ce 100%)" />
            <Card.Body p={6}>
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    APROVADOS
                  </Text>
                  <Heading size="2xl" color="gray.800" mt={2}>
                    {aprovados}
                  </Heading>
                </Box>
                <Box bg="blue.50" p={3} borderRadius="xl">
                  <Icon as={Users} color="blue.600" boxSize={7} />
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>

          <Card.Root
            bg="white"
            boxShadow="lg"
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
          >
            <Box h="4px" bg="linear-gradient(90deg, #9f7aea 0%, #805ad5 100%)" />
            <Card.Body p={6}>
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    MÉDIA GERAL
                  </Text>
                  <Heading size="2xl" color="gray.800" mt={2}>
                    {mediaPercentual}%
                  </Heading>
                </Box>
                <Box bg="purple.50" p={3} borderRadius="xl">
                  <Icon as={TrendingUp} color="purple.600" boxSize={7} />
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>

          <Card.Root
            bg="white"
            boxShadow="lg"
            borderRadius="xl"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: '2xl' }}
          >
            <Box h="4px" bg="linear-gradient(90deg, #ed8936 0%, #dd6b20 100%)" />
            <Card.Body p={6}>
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    PERÍODO
                  </Text>
                  <Heading size="xl" color="gray.800" mt={2}>
                    {referenceLabel}
                  </Heading>
                </Box>
                <Box bg="orange.50" p={3} borderRadius="xl">
                  <Icon as={Calendar} color="orange.600" boxSize={7} />
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>

        {/* Navegação de Mês */}
        <Card.Root bg="white" boxShadow="lg" borderRadius="xl">
          <Card.Body p={6}>
            <Flex align="center" justify="space-between" gap={4}>
              <Button onClick={handlePreviousMonth} variant="ghost" colorScheme="blue" size="lg">
                <Icon as={ChevronLeft} boxSize={5} />
              </Button>

              <Flex align="center" gap={4} flex="1" justify="center">
                <Icon as={Calendar} boxSize={5} color="blue.600" />
                <Heading size="lg" color="gray.700">
                  {referenceLabel}
                </Heading>
              </Flex>

              <Button onClick={handleNextMonth} variant="ghost" colorScheme="blue" size="lg">
                <Icon as={ChevronRight} boxSize={5} />
              </Button>
            </Flex>
          </Card.Body>
        </Card.Root>

        {/* Filtros */}
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <Flex align="center" gap={2} mb={4}>
            <Icon as={Filter} color="gray.600" boxSize={5} />
            <Heading size="md" color="gray.700">
              Filtros Avançados
            </Heading>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                Buscar Funcionário
              </Text>
              <Box position="relative">
                <Input
                  placeholder="Digite o nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="gray.50"
                  pl={10}
                />
                <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
                  <Icon as={Search} color="gray.400" boxSize={4} />
                </Box>
              </Box>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                Setor
              </Text>
              <chakra.select
                value={setorFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSetorFilter(e.target.value)}
                bg="gray.50"
                p={2}
                borderRadius="md"
                borderWidth="1px"
              >
                <option value="todos">Todos os Setores</option>
                {setores.map((setor) => (
                  <option key={setor} value={setor}>
                    {setor}
                  </option>
                ))}
              </chakra.select>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                Turno
              </Text>
              <chakra.select
                value={turnoFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setTurnoFilter(e.target.value)}
                bg="gray.50"
                p={2}
                borderRadius="md"
                borderWidth="1px"
              >
                <option value="todos">Todos os Turnos</option>
                {turnos.map((turno) => (
                  <option key={turno} value={turno}>
                    Turno {turno}
                  </option>
                ))}
              </chakra.select>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                Status
              </Text>
              <chakra.select
                value={statusFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                bg="gray.50"
                p={2}
                borderRadius="md"
                borderWidth="1px"
              >
                <option value="todos">Todos os Status</option>
                <option value="aprovado">Aprovados</option>
                <option value="reprovado">Reprovados</option>
                <option value="pendente">Pendentes</option>
              </chakra.select>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Tabela */}
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          <Box p={6} borderBottom="1px solid" borderColor="gray.200">
            <Heading size="md" color="gray.700">
              Registros de Comissões
            </Heading>
            <Text fontSize="sm" color="gray.500" mt={1}>
              {filteredData.length} registros encontrados
            </Text>
          </Box>

          <Box overflowX="auto">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row bg="gray.50">
                  <Table.ColumnHeader fontWeight="bold">Funcionário</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Setor/Turno
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Atendimentos
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Pontuação
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Máx. Possível
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Performance
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Status
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end" fontWeight="bold">
                    Bônus
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredData.map((item) => (
                  <Table.Row key={item.id} _hover={{ bg: 'gray.50' }} transition="all 0.2s">
                    <Table.Cell>
                      <Text fontWeight="medium">{item.name}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <VStack gap={1}>
                        <Text fontSize="sm">{item.setor}</Text>
                        <Badge
                          colorScheme={item.turno === 'A' ? 'purple' : 'cyan'}
                          variant="subtle"
                          fontSize="xs"
                        >
                          Turno {item.turno}
                        </Badge>
                      </VStack>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Text fontSize="sm" fontWeight="medium">
                        {item.atendimentos.toLocaleString('pt-BR')}
                      </Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center" fontWeight="bold" color="blue.600">
                      {item.pontuacao}
                    </Table.Cell>
                    <Table.Cell textAlign="center" color="gray.500">
                      <Text fontSize="sm">{item.maxPossivel}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Badge
                        colorScheme={
                          item.percentual >= 90 ? 'green' : item.percentual >= 80 ? 'blue' : 'red'
                        }
                        variant="solid"
                        fontSize="sm"
                        px={3}
                        py={1}
                      >
                        {item.percentual}%
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Badge
                        colorScheme={
                          item.status === 'APROVADO'
                            ? 'green'
                            : item.status === 'PENDENTE'
                              ? 'yellow'
                              : 'red'
                        }
                        variant="subtle"
                        px={3}
                        py={1}
                      >
                        {item.status === 'APROVADO'
                          ? 'Aprovado'
                          : item.status === 'PENDENTE'
                            ? 'Pendente'
                            : 'Reprovado'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <Text fontWeight="bold" color={item.bonus > 0 ? 'green.600' : 'gray.400'}>
                        R$ {item.bonus.toLocaleString('pt-BR')}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
