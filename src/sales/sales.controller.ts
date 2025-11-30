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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { AdicionarItemCarrinhoDto } from './dto/adicionar-item-carrinho.dto';
import { AtualizarItemCarrinhoDto } from './dto/atualizar-item-carrinho.dto';
import { ListarProdutosDto } from './dto/listar-produtos.dto';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';
import { CriarVariacaoDto } from './dto/criar-variacao.dto';
import { AtualizarVariacaoDto } from './dto/atualizar-variacao.dto';
import { UserRequest } from '../generics/decorators/user-in-request.decorator';
import { Roles } from '../generics/decorators/roles.decorator';
import { Public } from '../generics/decorators/public-decorator';
import { UsuariosEntity } from '../entities/usuarios.entity';
import {
  CarrinhoRes,
  FavoritosRes,
  MessageRes,
  ProdutoListagemRes,
} from './types/sales.types';
import { ProdutoCriadoRes } from './types/criar-produto.types';
import { CategoriaRes, ListaCategoriasRes } from './types/categoria.types';
import { VariacaoRes, ListaVariacoesRes } from './types/variacao.types';
import { ImagemUploadRes, ListaImagensRes } from './types/imagem.types';
import { CriarImagemDto } from './dto/criar-imagem.dto';
import { CriarCupomDto } from './dto/criar-cupom.dto';
import { AtualizarCupomDto } from './dto/atualizar-cupom.dto';
import { MulterFile } from '../generics/types/multer.types';
import { ListarVendedoresDto } from './dto/listar-vendedores.dto';
import { VendedorPublicoRes, ListaVendedoresRes } from './types/vendedor.types';
import { ProdutosEntity } from 'src/entities/produtos.entity';
import { AtualizarStatusPedidoDto } from './dto/atualizar-status-pedido.dto';
import { PedidoStatusAtualizadoRes } from './types/pedido.types';
import { CriarAvaliacaoDto } from './dto/criar-avaliacao.dto';
import {
  AvaliacaoCriadaRes,
  ListaAvaliacoesRes,
} from './types/avaliacao.types';

@Controller('sales')
@ApiTags('Sales')
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @ApiOperation({ summary: 'Obter carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Get('carrinho')
  obterCarrinho(@UserRequest() user: UsuariosEntity): Promise<CarrinhoRes> {
    return this.salesService.obterCarrinho(user.id);
  }

  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Post('carrinho/itens')
  @HttpCode(200)
  adicionarItemCarrinho(
    @Body() body: AdicionarItemCarrinhoDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<CarrinhoRes> {
    return this.salesService.adicionarItemCarrinho({
      ...body,
      usuarioId: user.id,
    });
  }

  @ApiOperation({ summary: 'Atualizar item do carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Put('carrinho/itens/:itemId')
  atualizarItemCarrinho(
    @Param('itemId') itemId: string,
    @Body() body: AtualizarItemCarrinhoDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<CarrinhoRes> {
    return this.salesService.atualizarItemCarrinho({
      usuarioId: user.id,
      itemId,
      quantidade: body.quantidade,
    });
  }

  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiOkResponse({ type: CarrinhoRes })
  @Delete('carrinho/itens/:itemId')
  removerItemCarrinho(
    @Param('itemId') itemId: string,
    @UserRequest() user: UsuariosEntity,
  ): Promise<CarrinhoRes> {
    return this.salesService.removerItemCarrinho({
      usuarioId: user.id,
      itemId,
    });
  }

  @ApiOperation({ summary: 'Limpar carrinho' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('carrinho')
  limparCarrinho(@UserRequest() user: UsuariosEntity): Promise<MessageRes> {
    return this.salesService.limparCarrinho(user.id);
  }

  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiOkResponse({ type: ProdutoCriadoRes })
  @Roles('vendedor')
  @Post('produtos')
  @HttpCode(201)
  criarProduto(
    @Body() body: CriarProdutoDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<ProdutoCriadoRes> {
    return this.salesService.criarProduto({ ...body, usuarioId: user.id });
  }

  @ApiOperation({ summary: 'Listar produtos' })
  @ApiOkResponse({ type: ProdutoListagemRes })
  @Public()
  @Get('produtos')
  listarProdutos(
    @Query() query: ListarProdutosDto,
    @UserRequest() user?: UsuariosEntity,
  ): Promise<ProdutoListagemRes> {
    return this.salesService.listarProdutos({
      ...query,
      usuarioId: user?.id,
      usuarioTipo: user?.tipo,
    });
  }

  @ApiOperation({ summary: 'Obter produto' })
  @ApiOkResponse({ type: ProdutosEntity })
  @Public()
  @Get('produtos/:id')
  obterProduto(
    @Param('id') id: string,
    @UserRequest() user?: UsuariosEntity,
  ): Promise<ProdutosEntity> {
    return this.salesService.obterProduto(id, user?.id, user?.tipo);
  }

  @ApiOperation({ summary: 'Listar favoritos' })
  @ApiOkResponse({ type: FavoritosRes })
  @Get('favoritos')
  listarFavoritos(@UserRequest() user: UsuariosEntity): Promise<FavoritosRes> {
    return this.salesService.listarFavoritos(user.id);
  }

  @ApiOperation({ summary: 'Adicionar produto aos favoritos' })
  @ApiOkResponse({ type: MessageRes })
  @Post('favoritos/:produtoId')
  @HttpCode(200)
  adicionarFavorito(
    @Param('produtoId') produtoId: string,
    @UserRequest() user: UsuariosEntity,
  ): Promise<MessageRes> {
    return this.salesService.adicionarFavorito(user.id, produtoId);
  }

  @ApiOperation({ summary: 'Remover produto dos favoritos' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('favoritos/:produtoId')
  removerFavorito(
    @Param('produtoId') produtoId: string,
    @UserRequest() user: UsuariosEntity,
  ): Promise<MessageRes> {
    return this.salesService.removerFavorito(user.id, produtoId);
  }

  @ApiOperation({ summary: 'Remover todos os favoritos do usuário' })
  @ApiOkResponse({ type: MessageRes })
  @Delete('favoritos')
  removerTodosFavoritos(
    @UserRequest() user: UsuariosEntity,
  ): Promise<MessageRes> {
    return this.salesService.removerTodosFavoritos(user.id);
  }

  @ApiOperation({ summary: 'Criar nova categoria' })
  @ApiOkResponse({ type: CategoriaRes })
  @Roles('vendedor', 'admin')
  @Post('categorias')
  @HttpCode(201)
  criarCategoria(@Body() body: CriarCategoriaDto): Promise<CategoriaRes> {
    return this.salesService.criarCategoria(body);
  }

  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiOkResponse({ type: ListaCategoriasRes })
  @Get('categorias')
  listarCategorias(): Promise<ListaCategoriasRes> {
    return this.salesService.listarCategorias();
  }

  @ApiOperation({ summary: 'Obter categoria por ID' })
  @ApiOkResponse({ type: CategoriaRes })
  @Get('categorias/:id')
  obterCategoria(@Param('id') id: string): Promise<CategoriaRes> {
    return this.salesService.obterCategoria(id);
  }

  @ApiOperation({ summary: 'Atualizar categoria' })
  @ApiOkResponse({ type: CategoriaRes })
  @Roles('vendedor', 'admin')
  @Put('categorias/:id')
  atualizarCategoria(
    @Param('id') id: string,
    @Body() body: AtualizarCategoriaDto,
  ): Promise<CategoriaRes> {
    return this.salesService.atualizarCategoria({ id, ...body });
  }

  @ApiOperation({ summary: 'Excluir categoria' })
  @ApiOkResponse({ type: MessageRes })
  @Roles('vendedor', 'admin')
  @Delete('categorias/:id')
  excluirCategoria(@Param('id') id: string): Promise<MessageRes> {
    return this.salesService.excluirCategoria(id);
  }

  @ApiOperation({ summary: 'Criar nova variação de produto' })
  @ApiOkResponse({ type: VariacaoRes })
  @Roles('vendedor')
  @Post('variacoes')
  @HttpCode(201)
  criarVariacao(
    @Body() body: CriarVariacaoDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<VariacaoRes> {
    return this.salesService.criarVariacao({
      ...body,
      usuarioId: user.id,
      usuarioTipo: user.tipo,
    });
  }

  @ApiOperation({ summary: 'Listar variações de um produto' })
  @ApiOkResponse({ type: ListaVariacoesRes })
  @Public()
  @Get('variacoes/produto/:produtoId')
  listarVariacoesProduto(
    @Param('produtoId') produtoId: string,
    @UserRequest() user?: UsuariosEntity,
  ): Promise<ListaVariacoesRes> {
    return this.salesService.listarVariacoesProduto(
      produtoId,
      user?.id,
      user?.tipo,
    );
  }

  @ApiOperation({ summary: 'Obter variação por ID' })
  @ApiOkResponse({ type: VariacaoRes })
  @Public()
  @Get('variacoes/:id')
  obterVariacao(
    @Param('id') id: string,
    @UserRequest() user?: UsuariosEntity,
  ): Promise<VariacaoRes> {
    return this.salesService.obterVariacao(id, user?.id, user?.tipo);
  }

  @ApiOperation({ summary: 'Atualizar variação' })
  @ApiOkResponse({ type: VariacaoRes })
  @Roles('vendedor')
  @Put('variacoes/:id')
  atualizarVariacao(
    @Param('id') id: string,
    @Body() body: AtualizarVariacaoDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<VariacaoRes> {
    return this.salesService.atualizarVariacao({
      id,
      ...body,
      usuarioId: user.id,
      usuarioTipo: user.tipo,
    });
  }

  @ApiOperation({ summary: 'Excluir variação' })
  @ApiOkResponse({ type: MessageRes })
  @Roles('vendedor')
  @Delete('variacoes/:id')
  excluirVariacao(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Promise<MessageRes> {
    return this.salesService.excluirVariacao(id, user.id, user.tipo);
  }

  @ApiOperation({ summary: 'Fazer upload de imagem do produto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        produtoId: { type: 'string' },
        tipo: { type: 'string', enum: ['principal', 'galeria', 'miniatura'] },
        legenda: { type: 'string' },
        ordem: { type: 'number' },
      },
      required: ['file', 'produtoId', 'tipo'],
    },
  })
  @ApiOkResponse({ type: ImagemUploadRes })
  @Roles('vendedor')
  @Post('imagens/upload')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  uploadImagem(
    @UploadedFile() file: MulterFile,
    @Body() body: CriarImagemDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<ImagemUploadRes> {
    return this.salesService.uploadImagem({
      ...body,
      file: {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      },
      usuarioId: user.id,
      usuarioTipo: user.tipo,
    });
  }

  @ApiOperation({ summary: 'Listar imagens de um produto' })
  @ApiOkResponse({ type: ListaImagensRes })
  @Public()
  @Get('imagens/produto/:produtoId')
  listarImagensProduto(
    @Param('produtoId') produtoId: string,
    @UserRequest() user?: UsuariosEntity,
  ): Promise<ListaImagensRes> {
    return this.salesService.listarImagensProduto(
      produtoId,
      user?.id,
      user?.tipo,
    );
  }

  @ApiOperation({ summary: 'Excluir imagem' })
  @ApiOkResponse({ type: MessageRes })
  @Roles('vendedor')
  @Delete('imagens/:id')
  excluirImagem(
    @Param('id') id: string,
    @UserRequest() user: UsuariosEntity,
  ): Promise<MessageRes> {
    return this.salesService.excluirImagem(id, user.id, user.tipo);
  }

  @ApiOperation({ summary: 'Listar vendedores (lojas) aprovados' })
  @ApiOkResponse({ type: ListaVendedoresRes })
  @Public()
  @Get('vendedores')
  listarVendedores(
    @Query() query: ListarVendedoresDto,
  ): Promise<ListaVendedoresRes> {
    return this.salesService.listarVendedores(query);
  }

  @ApiOperation({ summary: 'Obter vendedor por ID' })
  @ApiOkResponse({ type: VendedorPublicoRes })
  @Public()
  @Get('vendedores/:id')
  obterVendedor(@Param('id') id: string): Promise<VendedorPublicoRes> {
    return this.salesService.obterVendedor(id);
  }

  @ApiOperation({ summary: 'Obter vendedor por usuário id' })
  @ApiOkResponse({ type: VendedorPublicoRes })
  @Public()
  @Get('vendedores/usuario/:id')
  obterVendedorPorUuid(@Param('id') id: string): Promise<VendedorPublicoRes> {
    return this.salesService.obterVendedorPorUsuarioId(id);
  }

  @ApiOperation({ summary: 'Atualizar status do pedido' })
  @ApiOkResponse({ type: PedidoStatusAtualizadoRes })
  @Put('pedidos/:id/status')
  atualizarStatusPedido(
    @Param('id') id: string,
    @Body() body: AtualizarStatusPedidoDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<PedidoStatusAtualizadoRes> {
    return this.salesService.atualizarStatusPedido(
      id,
      body,
      user.id,
      user.tipo,
    );
  }

  @ApiOperation({ summary: 'Criar avaliação de produto' })
  @ApiOkResponse({ type: AvaliacaoCriadaRes })
  @Post('avaliacoes')
  @HttpCode(201)
  criarAvaliacao(
    @Body() body: CriarAvaliacaoDto,
    @UserRequest() user: UsuariosEntity,
  ): Promise<AvaliacaoCriadaRes> {
    return this.salesService.criarAvaliacao(body, user.id);
  }

  @ApiOperation({ summary: 'Listar avaliações de um produto' })
  @ApiOkResponse({ type: ListaAvaliacoesRes })
  @Public()
  @Get('produtos/:produtoId/avaliacoes')
  listarAvaliacoesProduto(
    @Param('produtoId') produtoId: string,
  ): Promise<ListaAvaliacoesRes> {
    return this.salesService.listarAvaliacoesProduto(produtoId);
  }

  @ApiOperation({ summary: 'Criar cupom' })
  @Post('cupons')
  @HttpCode(201)
  criarCupom(@Body() body: CriarCupomDto) {
    return this.salesService.criarCupom(body);
  }

  @ApiOperation({ summary: 'Listar todos os cupons' })
  @Get('cupons')
  listarCupons() {
    return this.salesService.listarCupons();
  }

  @ApiOperation({ summary: 'Obter cupom por ID' })
  @Get('cupons/:id')
  obterCupom(@Param('id') id: string) {
    return this.salesService.obterCupom(id);
  }

  @ApiOperation({ summary: 'Buscar cupom por código' })
  @Get('cupons/codigo/:codigo')
  buscarCupomPorCodigo(@Param('codigo') codigo: string) {
    return this.salesService.buscarCupomPorCodigo(codigo);
  }

  @ApiOperation({ summary: 'Atualizar cupom' })
  @Put('cupons/:id')
  atualizarCupom(@Param('id') id: string, @Body() body: AtualizarCupomDto) {
    return this.salesService.atualizarCupom(id, body);
  }

  @ApiOperation({ summary: 'Deletar cupom' })
  @Delete('cupons/:id')
  deletarCupom(@Param('id') id: string) {
    return this.salesService.deletarCupom(id);
  }

  @ApiOperation({ summary: 'Obter total de vendas do vendedor' })
  @Get('vendedores/:id/vendas')
  getTotalVendasVendedor(@Param('id') id: string) {
    return this.salesService.getTotalVendasVendedor(id);
  }
}
