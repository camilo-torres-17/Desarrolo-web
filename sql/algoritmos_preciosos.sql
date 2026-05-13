-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-05-2026 a las 16:36:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `algoritmos_preciosos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` int(11) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `precio`, `categoria`, `descripcion`, `imagen`) VALUES
(2, 'Anillo Umbral', 830000, 'anillos', 'Camilo cambia esto facil jajaja', '/images/inicio/anilloumbral.png'),
(3, 'Cadena Plana', 1200000, 'cadenas', 'La elegancia no se improvisa.', '/images/inicio/cadenaplana.png'),
(4, 'Anillo Hombre', 1800000, 'anillos', 'La elegancia no se improvisa.', '/images/inicio/anillohombre.png'),
(5, 'Pulsera Silente', 1300000, 'pulseras', 'La elegancia no se improvisa.', '/images/inicio/pulserasilente.png'),
(6, 'Dije Esmeralda', 900000, 'dijes', 'La elegancia no se improvisa.', '/images/inicio/dijeesmeralda.png'),
(7, 'Pulsera Italiana', 1300000, 'pulseras', 'La elegancia no se improvisa.', '/images/inicio/pulseraitaliana.png'),
(8, 'Anillo Adeline', 725000, 'anillos', 'La elegancia no se improvisa.', '/images/uploads/anillo3.png'),
(9, 'Dije Bailarina', 400000, 'dijes', 'La elegancia no se improvisa.', '/images/uploads/dijebailarina.png'),
(10, 'Cadena Cubana', 750000, 'cadenas', 'La elegancia no se improvisa.', '/images/uploads/cadenacubana.png'),
(11, 'Cadena Crispeta', 600000, 'cadenas', 'La elegancia no se improvisa.', '/images/uploads/cadenacrispeta.png'),
(12, 'Dije Guadalupana', 500000, 'dijes', 'La elegancia no se improvisa.', '/images/uploads/dijeguadalupana.jpg'),
(13, 'Candongas Calabaza', 200000, 'aretes', 'La elegancia no se improvisa.', '/images/uploads/candongascalabaza.jpg'),
(14, 'Candongas Espiral', 450000, 'aretes', 'La elegancia no se improvisa.', '/images/uploads/candongasespiral.webp'),
(15, 'Candongas Kasandra', 450000, 'aretes', 'La elegancia no se improvisa.', '/images/uploads/candongaskasandra.jpg'),
(16, 'Pulsera Especial Tensha', 750000, 'pulseras', 'La elegancia no se improvisa.', '/images/uploads/pulseratensha.jpg'),
(17, 'Topo Esmeralda Julia', 900000, 'esmeraldas', 'La elegancia no se improvisa.', '/images/uploads/esmeraldajuliatopo.jpg'),
(18, 'Topo Esmeralda Maral', 800000, 'esmeraldas', 'La elegancia no se improvisa.', '/images/uploads/esmeraldamaraltopo.jpg'),
(19, 'Topo Esmeralda Napoles', 950000, 'esmeraldas', 'La elegancia no se improvisa.', '/images/uploads/esmeraldanapolestopo.jpg'),
(20, 'Anillo Hombre Alma Firme', 1100000, 'lineaH', 'La elegancia no se improvisa.', '/images/uploads/almafirmehombre.jpg'),
(21, 'Anillo Hombre Cruz Circonada', 1000000, 'lineaH', 'La elegancia no se improvisa.', '/images/uploads/cruzcircondahombre.jpg'),
(22, 'Anillo Hombre Sendero', 900000, 'lineaH', 'La elegancia no se improvisa.', '/images/uploads/hombresendero.jpg'),
(23, 'Choker Summer', 500000, 'lineaM', 'La elegancia no se improvisa.', '/images/uploads/chokersummermujer.png'),
(24, 'Cadena Especial Kasandra', 860000, 'lineaM', 'La elegancia no se improvisa.', '/images/uploads/especialkasandramujer.jpg'),
(25, 'Cadena Especial Rochelle', 780000, 'lineaM', 'La elegancia no se improvisa.', '/images/uploads/especialrochellemujer.jpg');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
