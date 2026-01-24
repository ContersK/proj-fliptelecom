"use client";

import React, { useState, type ChangeEvent } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  chakra,
  InputGroup,
  SimpleGrid,
  Table,
  Text,
  VStack,
  Badge,
  Card,
} from "@chakra-ui/react";
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
} from "lucide-react";

// Dados simulados com múltiplos meses
const COMISSOES_DATA = [
  {
    id: 1,
    funcionario: "Rafael Alencar",
    setor: "Suporte N1",
    turno: "A",
    mes: "Janeiro",
    ano: 2026,
    nota5: 45,
    nota4: 30,
    nota3: 8,
    nota2: 2,
    nota1: 1,
    percentual: 93,
    valor: 300,
    status: "aprovado",
  },
  {
    id: 2,
    funcionario: "Junior Silva",
    setor: "Suporte N1",
    turno: "A",
    mes: "Janeiro",
    ano: 2026,
    nota5: 62,
    nota4: 40,
    nota3: 5,
    nota2: 1,
    nota1: 0,
    percentual: 95,
    valor: 300,
    status: "aprovado",
  },
  {
    id: 3,
    funcionario: "Erik Santos",
    setor: "Suporte N1",
    turno: "A",
    mes: "Janeiro",
    ano: 2026,
    nota5: 15,
    nota4: 20,
    nota3: 25,
    nota2: 10,
    nota1: 5,
    percentual: 65,
    valor: 0,
    status: "reprovado",
  },
  {
    id: 4,
    funcionario: "Rafael Alencar",
    setor: "Suporte N1",
    turno: "A",
    mes: "Dezembro",
    ano: 2025,
    nota5: 50,
    nota4: 25,
    nota3: 5,
    nota2: 1,
    nota1: 0,
    percentual: 94,
    valor: 300,
    status: "aprovado",
  },
  {
    id: 5,
    funcionario: "Junior Silva",
    setor: "Suporte N1",
    turno: "A",
    mes: "Dezembro",
    ano: 2025,
    nota5: 55,
    nota4: 30,
    nota3: 8,
    nota2: 2,
    nota1: 1,
    percentual: 91,
    valor: 300,
    status: "aprovado",
  },
];

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function ComissoesPage() {
  const currentDate = new Date();
  const [selectedMes, setSelectedMes] = useState(MESES[currentDate.getMonth()]);
  const [selectedAno, setSelectedAno] = useState(currentDate.getFullYear());
  const [searchTerm, setSearchTerm] = useState("");
  const [setorFilter, setSetorFilter] = useState("todos");
  const [turnoFilter, setTurnoFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Navegar entre meses
  const handlePreviousMonth = () => {
    const currentIndex = MESES.indexOf(selectedMes);
    if (currentIndex > 0) {
      setSelectedMes(MESES[currentIndex - 1]);
    } else {
      setSelectedMes(MESES[11]);
      setSelectedAno(selectedAno - 1);
    }
  };

  const handleNextMonth = () => {
    const currentIndex = MESES.indexOf(selectedMes);
    if (currentIndex < 11) {
      setSelectedMes(MESES[currentIndex + 1]);
    } else {
      setSelectedMes(MESES[0]);
      setSelectedAno(selectedAno + 1);
    }
  };

  // Filtrar dados
  const filteredData = COMISSOES_DATA.filter((item) => {
    const matchSearch = item.funcionario
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchMes = item.mes === selectedMes && item.ano === selectedAno;
    const matchSetor = setorFilter === "todos" || item.setor === setorFilter;
    const matchTurno = turnoFilter === "todos" || item.turno === turnoFilter;
    const matchStatus =
      statusFilter === "todos" || item.status === statusFilter;
    return matchSearch && matchMes && matchSetor && matchTurno && matchStatus;
  });

  // Cálculos
  const totalPagar = filteredData.reduce(
    (acc, curr) => acc + (curr.status === "aprovado" ? curr.valor : 0),
    0,
  );
  const aprovados = filteredData.filter((i) => i.status === "aprovado").length;
  const mediaPercentual = Math.round(
    filteredData.reduce((acc, curr) => acc + curr.percentual, 0) /
      (filteredData.length || 1),
  );

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
            <Button colorScheme="purple" size="md">
              <Icon as={Calendar} boxSize={4} mr={2} />
              Fechar Período
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
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Box
              h="4px"
              bg="linear-gradient(90deg, #48bb78 0%, #38a169 100%)"
            />
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
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Box
              h="4px"
              bg="linear-gradient(90deg, #4299e1 0%, #3182ce 100%)"
            />
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
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Box
              h="4px"
              bg="linear-gradient(90deg, #9f7aea 0%, #805ad5 100%)"
            />
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
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl" }}
          >
            <Box
              h="4px"
              bg="linear-gradient(90deg, #ed8936 0%, #dd6b20 100%)"
            />
            <Card.Body p={6}>
              <Flex justify="space-between" align="start">
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold">
                    PERÍODO
                  </Text>
                  <Heading size="xl" color="gray.800" mt={2}>
                    {selectedMes.substring(0, 3)}/{selectedAno}
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
              <Button
                onClick={handlePreviousMonth}
                variant="ghost"
                colorScheme="blue"
                size="lg"
              >
                <Icon as={ChevronLeft} boxSize={5} />
              </Button>

              <Flex align="center" gap={4} flex="1" justify="center">
                <Icon as={Calendar} boxSize={5} color="blue.600" />
                <Heading size="lg" color="gray.700">
                  {selectedMes} de {selectedAno}
                </Heading>
              </Flex>

              <Button
                onClick={handleNextMonth}
                variant="ghost"
                colorScheme="blue"
                size="lg"
              >
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
              <InputGroup
                startElement={<Icon as={Search} color="gray.400" ml={3} />}
              >
                <Input
                  placeholder="Digite o nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="gray.50"
                />
              </InputGroup>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                Setor
              </Text>
              <chakra.select
                value={setorFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSetorFilter(e.target.value)
                }
                bg="gray.50"
                p={2}
                borderRadius="md"
                borderWidth="1px"
              >
                <option value="todos">Todos os Setores</option>
                <option value="Suporte N1">Suporte N1</option>
                <option value="Suporte N2">Suporte N2</option>
                <option value="Vendas">Vendas</option>
                <option value="Administrativo">Administrativo</option>
              </chakra.select>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                Turno
              </Text>
              <chakra.select
                value={turnoFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setTurnoFilter(e.target.value)
                }
                bg="gray.50"
                p={2}
                borderRadius="md"
                borderWidth="1px"
              >
                <option value="todos">Todos os Turnos</option>
                <option value="A">Turno A</option>
                <option value="B">Turno B</option>
                <option value="C">Turno C</option>
              </chakra.select>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                Status
              </Text>
              <chakra.select
                value={statusFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(e.target.value)
                }
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
                  <Table.ColumnHeader fontWeight="bold">
                    Funcionário
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Setor/Turno
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Período
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Notas
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Performance
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center" fontWeight="bold">
                    Status
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end" fontWeight="bold">
                    Valor
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredData.map((item) => (
                  <Table.Row
                    key={item.id}
                    _hover={{ bg: "gray.50" }}
                    transition="all 0.2s"
                  >
                    <Table.Cell>
                      <Text fontWeight="medium">{item.funcionario}</Text>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <VStack gap={1}>
                        <Text fontSize="sm">{item.setor}</Text>
                        <Badge
                          colorScheme={item.turno === "A" ? "purple" : "cyan"}
                          variant="subtle"
                          fontSize="xs"
                        >
                          Turno {item.turno}
                        </Badge>
                      </VStack>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Text fontSize="sm">
                        {item.mes}/{item.ano}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack justify="center" gap={1}>
                        <Badge
                          colorScheme="green"
                          variant="solid"
                          fontSize="xs"
                        >
                          5★: {item.nota5}
                        </Badge>
                        <Badge colorScheme="blue" variant="solid" fontSize="xs">
                          4★: {item.nota4}
                        </Badge>
                        <Badge
                          colorScheme="yellow"
                          variant="solid"
                          fontSize="xs"
                        >
                          3★: {item.nota3}
                        </Badge>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Badge
                        colorScheme={
                          item.percentual >= 90
                            ? "green"
                            : item.percentual >= 80
                              ? "blue"
                              : "red"
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
                          item.status === "aprovado" ? "green" : "red"
                        }
                        variant="subtle"
                        px={3}
                        py={1}
                      >
                        {item.status === "aprovado" ? "Aprovado" : "Reprovado"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <Text
                        fontWeight="bold"
                        color={item.valor > 0 ? "green.600" : "gray.400"}
                      >
                        R$ {item.valor},00
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
