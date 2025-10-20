import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { Observable } from 'rxjs';
import { AdicionarItemCarrinhoDto } from './dto/adicionar-item-carrinho.dto';
import { AtualizarItemCarrinhoDto } from './dto/atualizar-item-carrinho.dto';
import { ListarProdutosDto } from './dto/listar-produtos.dto';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';
import { CriarVariacaoDto } from './dto/criar-variacao.dto';
import { AtualizarVariacaoDto } from './dto/atualizar-variacao.dto';
import { UserRequest } from 'apps/generics/decorators/user-in-request.decorator';
import { UsuariosEntity } from 'apps/entities/usuarios.entity';
import {
  CarrinhoRes,
  FavoritosRes,
  MessageRes,
  ProdutoDetalheRes,
  ProdutoListagemRes,
} from './types/sales.types';
import { ProdutoCriadoRes } from './types/criar-produto.types';
import { CategoriaRes, ListaCategoriasRes } from './types/categoria.types';
import { VariacaoRes, ListaVariacoesRes } from './types/variacao.types';

@Controller('sales')
@ApiTags('Sales')
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @ApiOperation({ summary: 'Obter carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Get('carrinho')
  obterCarrinho(@UserRequest() user: UsuariosEntity): Observable<CarrinhoRes> {
    return this.salesService.obterCarrinho(user);
  }

  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Post('carrinho/itens')
  @HttpCode(200)
  adicionarItemCarrinho(
    @Body() body: AdicionarItemCarrinhoDto,
    @UserRequest() user: UsuariosEntity,
  ): Observable<CarrinhoRes> {
    return this.salesService.adicionarItemCarrinho(user.id, body);
  }

  @ApiOperation({ summary: 'Atualizar item do carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Put('carrinho/itens/:itemId')
  atualizarItemCarrinho(
    @Param('itemId') itemId: string,
    @Body() body: AtualizarItemCarrinhoDto,
    @UserRequest() user: UsuariosEntity,
  ): Observable<CarrinhoRes> {
    return this.salesService.atualizarItemCarrinho(
      user.id,
      itemId,
      body.quantidade,
    );
  }

  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Delete('carrinho/itens/:itemId')
  removerItemCarrinho(
    @Param('itemId') itemId: string,
    @UserRequest() user: UsuariosEntity,
  ): Observable<CarrinhoRes> {
    return this.salesService.removerItemCarrinho(user.id, itemId);
  }

  @ApiOperation({ summary: 'Limpar carrinho' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('carrinho')
  limparCarrinho(@UserRequest() user: UsuariosEntity): Observable<MessageRes> {
    return this.salesService.limparCarrinho(user.id);
  }

  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiOkResponse({ type: ProdutoCriadoRes })
  @Post('produtos')
  @HttpCode(201)
  criarProduto(
    @Body() body: CriarProdutoDto,
    @UserRequest() user: UsuariosEntity,
  ): Observable<ProdutoCriadoRes> {
    return this.salesService.criarProduto(user.id, body);
  }

  @ApiOperation({ summary: 'Listar produtos' })
  @ApiOkResponse({ type: ProdutoListagemRes })
  @Get('produtos')
  listarProdutos(
    @Query() query: ListarProdutosDto,
  ): Observable<ProdutoListagemRes> {
    return this.salesService.listarProdutos(query);
  }

  @ApiOperation({ summary: 'Obter produto' })
  @ApiOkResponse({ type: ProdutoDetalheRes })
  @Get('produtos/:id')
  obterProduto(@Param('id') id: string): Observable<ProdutoDetalheRes> {
    return this.salesService.obterProduto(id);
  }

  @ApiOperation({ summary: 'Listar favoritos' })
  @ApiOkResponse({ type: FavoritosRes })
  @Get('favoritos')
  listarFavoritos(
    @UserRequest() user: UsuariosEntity,
  ): Observable<FavoritosRes> {
    return this.salesService.listarFavoritos(user.id);
  }

  @ApiOperation({ summary: 'Adicionar produto aos favoritos' })
  @ApiOkResponse({ type: MessageRes })
  @Post('favoritos/:produtoId')
  @HttpCode(200)
  adicionarFavorito(
    @Param('produtoId') produtoId: string,
    @UserRequest() user: UsuariosEntity,
  ): Observable<MessageRes> {
    return this.salesService.adicionarFavorito(user.id, produtoId);
  }

  @ApiOperation({ summary: 'Remover produto dos favoritos' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('favoritos/:produtoId')
  removerFavorito(
    @Param('produtoId') produtoId: string,
    @UserRequest() user: UsuariosEntity,
  ): Observable<MessageRes> {
    return this.salesService.removerFavorito(user.id, produtoId);
  }

  // Categorias
  @ApiOperation({ summary: 'Criar nova categoria' })
  @ApiOkResponse({ type: CategoriaRes })
  @Post('categorias')
  @HttpCode(201)
  criarCategoria(@Body() body: CriarCategoriaDto): Observable<CategoriaRes> {
    return this.salesService.criarCategoria(body);
  }

  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiOkResponse({ type: ListaCategoriasRes })
  @Get('categorias')
  listarCategorias(): Observable<ListaCategoriasRes> {
    return this.salesService.listarCategorias();
  }

  @ApiOperation({ summary: 'Obter categoria por ID' })
  @ApiOkResponse({ type: CategoriaRes })
  @Get('categorias/:id')
  obterCategoria(@Param('id') id: string): Observable<CategoriaRes> {
    return this.salesService.obterCategoria(id);
  }

  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiOkResponse({ type: CategoriaRes })
  @Put('categorias/:id')
  atualizarCategoria(
    @Param('id') id: string,
    @Body() body: AtualizarCategoriaDto,
  ): Observable<CategoriaRes> {
    return this.salesService.atualizarCategoria(id, body);
  }

  @ApiOperation({ summary: 'Excluir categoria' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('categorias/:id')
  excluirCategoria(@Param('id') id: string): Observable<MessageRes> {
    return this.salesService.excluirCategoria(id);
  }

  // Variações
  @ApiOperation({ summary: 'Criar nova variação de produto' })
  @ApiOkResponse({ type: VariacaoRes })
  @Post('variacoes')
  @HttpCode(201)
  criarVariacao(@Body() body: CriarVariacaoDto): Observable<VariacaoRes> {
    return this.salesService.criarVariacao(body);
  }

  @ApiOperation({ summary: 'Listar variações de um produto' })
  @ApiOkResponse({ type: ListaVariacoesRes })
  @Get('variacoes/produto/:produtoId')
  listarVariacoesProduto(
    @Param('produtoId') produtoId: string,
  ): Observable<ListaVariacoesRes> {
    return this.salesService.listarVariacoesProduto(produtoId);
  }

  @ApiOperation({ summary: 'Obter variação por ID' })
  @ApiOkResponse({ type: VariacaoRes })
  @Get('variacoes/:id')
  obterVariacao(@Param('id') id: string): Observable<VariacaoRes> {
    return this.salesService.obterVariacao(id);
  }

  @ApiOperation({ summary: 'Atualizar variação' })
  @ApiOkResponse({ type: VariacaoRes })
  @Put('variacoes/:id')
  atualizarVariacao(
    @Param('id') id: string,
    @Body() body: AtualizarVariacaoDto,
  ): Observable<VariacaoRes> {
    return this.salesService.atualizarVariacao(id, body);
  }

  @ApiOperation({ summary: 'Excluir variação' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('variacoes/:id')
  excluirVariacao(@Param('id') id: string): Observable<MessageRes> {
    return this.salesService.excluirVariacao(id);
  }
}
