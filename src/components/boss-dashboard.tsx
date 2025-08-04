"use client"

import { useState, useEffect } from "react"
import { Play, Square, Users, Clock, DollarSign, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Employee {
  id: number
  name: string
  position: string
  hourlyRate: number
  isWorking: boolean
  shiftStart?: Date
  totalHoursToday: number
  totalEarningsToday: number
}

export default function BossDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "Анна Петрова",
      position: "Разработчик",
      hourlyRate: 2500,
      isWorking: false,
      totalHoursToday: 6.5,
      totalEarningsToday: 16250,
    },
    {
      id: 2,
      name: "Михаил Сидоров",
      position: "Дизайнер",
      hourlyRate: 2000,
      isWorking: true,
      shiftStart: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
      totalHoursToday: 2,
      totalEarningsToday: 4000,
    },
    {
      id: 3,
      name: "Елена Козлова",
      position: "Менеджер проектов",
      hourlyRate: 3000,
      isWorking: false,
      totalHoursToday: 8,
      totalEarningsToday: 24000,
    },
    {
      id: 4,
      name: "Дмитрий Волков",
      position: "Тестировщик",
      hourlyRate: 1800,
      isWorking: true,
      shiftStart: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 часа назад
      totalHoursToday: 4,
      totalEarningsToday: 7200,
    },
    {
      id: 5,
      name: "Ольга Морозова",
      position: "Аналитик",
      hourlyRate: 2200,
      isWorking: false,
      totalHoursToday: 7,
      totalEarningsToday: 15400,
    },
  ])

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const startShift = (employeeId: number) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === employeeId ? { ...emp, isWorking: true, shiftStart: new Date() } : emp)),
    )
  }

  const endShift = (employeeId: number) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId && emp.shiftStart) {
          const hoursWorked = (Date.now() - emp.shiftStart.getTime()) / (1000 * 60 * 60)
          const earnings = hoursWorked * emp.hourlyRate

          return {
            ...emp,
            isWorking: false,
            shiftStart: undefined,
            totalHoursToday: emp.totalHoursToday + hoursWorked,
            totalEarningsToday: emp.totalEarningsToday + earnings,
          }
        }
        return emp
      }),
    )
  }

  const getCurrentShiftDuration = (employee: Employee) => {
    if (!employee.isWorking || !employee.shiftStart) return 0
    return (currentTime.getTime() - employee.shiftStart.getTime()) / (1000 * 60 * 60)
  }

  const getCurrentEarnings = (employee: Employee) => {
    const currentShiftHours = getCurrentShiftDuration(employee)
    return employee.totalEarningsToday + currentShiftHours * employee.hourlyRate
  }

  // Статистика отдела
  const totalEmployees = employees.length
  const activeEmployees = employees.filter((emp) => emp.isWorking).length
  const totalDailyEarnings = employees.reduce((sum, emp) => sum + getCurrentEarnings(emp), 0)
  const totalDailyHours = employees.reduce((sum, emp) => {
    return sum + emp.totalHoursToday + getCurrentShiftDuration(emp)
  }, 0)
  const averageHourlyRate = employees.reduce((sum, emp) => sum + emp.hourlyRate, 0) / employees.length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Панель управления отделом</h1>
            <p className="text-gray-600 mt-1">Управление сотрудниками и отслеживание рабочего времени</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Текущее время</p>
            <p className="text-lg font-semibold">{currentTime.toLocaleTimeString("ru-RU")}</p>
          </div>
        </div>

        {/* Статистика отдела */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего сотрудников</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">{activeEmployees} активных сейчас</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Отработано часов сегодня</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDailyHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">часов всего</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Заработано сегодня</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDailyEarnings.toLocaleString("ru-RU")} ₽</div>
              <p className="text-xs text-muted-foreground">общая сумма</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Средняя ставка</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageHourlyRate.toLocaleString("ru-RU")} ₽</div>
              <p className="text-xs text-muted-foreground">за час</p>
            </CardContent>
          </Card>
        </div>

        {/* Таблица сотрудников */}
        <Card>
          <CardHeader>
            <CardTitle>Сотрудники отдела</CardTitle>
            <CardDescription>Управление рабочими сменами и отслеживание заработка</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Сотрудник</TableHead>
                  <TableHead>Должность</TableHead>
                  <TableHead>Ставка/час</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Текущая смена</TableHead>
                  <TableHead>Часов сегодня</TableHead>
                  <TableHead>Заработано сегодня</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => {
                  const currentShiftHours = getCurrentShiftDuration(employee)
                  const currentEarnings = getCurrentEarnings(employee)

                  return (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.hourlyRate.toLocaleString("ru-RU")} ₽</TableCell>
                      <TableCell>
                        <Badge variant={employee.isWorking ? "default" : "secondary"}>
                          {employee.isWorking ? "Работает" : "Не работает"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {employee.isWorking && employee.shiftStart ? (
                          <div className="text-sm">
                            <div>{currentShiftHours.toFixed(1)} ч</div>
                            <div className="text-muted-foreground">
                              с{" "}
                              {employee.shiftStart.toLocaleTimeString("ru-RU", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{(employee.totalHoursToday + currentShiftHours).toFixed(1)} ч</TableCell>
                      <TableCell>{currentEarnings.toLocaleString("ru-RU")} ₽</TableCell>
                      <TableCell>
                        {employee.isWorking ? (
                          <Button variant="destructive" size="sm" onClick={() => endShift(employee.id)}>
                            <Square className="h-4 w-4 mr-1" />
                            Закончить
                          </Button>
                        ) : (
                          <Button variant="default" size="sm" onClick={() => startShift(employee.id)}>
                            <Play className="h-4 w-4 mr-1" />
                            Начать
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Инфографика по позициям */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Распределение по должностям</CardTitle>
              <CardDescription>Количество сотрудников по позициям</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(new Set(employees.map((emp) => emp.position))).map((position) => {
                  const positionEmployees = employees.filter((emp) => emp.position === position)
                  const count = positionEmployees.length
                  const avgRate = positionEmployees.reduce((sum, emp) => sum + emp.hourlyRate, 0) / count

                  return (
                    <div key={position} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{position}</p>
                        <p className="text-sm text-muted-foreground">
                          Средняя ставка: {avgRate.toLocaleString("ru-RU")} ₽/час
                        </p>
                      </div>
                      <Badge variant="outline">{count} чел.</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Активность сегодня</CardTitle>
              <CardDescription>Статистика работы сотрудников</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Активные сотрудники</p>
                    <p className="text-sm text-green-600">Работают прямо сейчас</p>
                  </div>
                  <div className="text-2xl font-bold text-green-800">{activeEmployees}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Общее время</p>
                    <p className="text-sm text-blue-600">Отработано сегодня</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-800">{totalDailyHours.toFixed(1)}ч</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-800">Общий доход</p>
                    <p className="text-sm text-purple-600">Заработано сегодня</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-800">{(totalDailyEarnings / 1000).toFixed(0)}к ₽</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
