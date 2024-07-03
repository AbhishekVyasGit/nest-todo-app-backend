import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller('todo')
@ApiTags('Todo')
@ApiSecurity('JWT-auth')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post(":userId")
  create(@Body(ValidationPipe) createTodoDto: CreateTodoDto, @Param('userId') userId: number,) {
    return this.todoService.create(createTodoDto, Number(userId));
  }


  @Get("/completed/:userId")
  findAllCompletedTodosByUser(@Param('userId') userId: number) {
    return this.todoService.findAllCompletedTodosByUser(Number(userId));
  }


  @Get("/notCompleted/:userId")
  findAllNotCompletedTodosByUser(@Param('userId') userId: number) {
    return this.todoService.findAllNotCompletedTodosByUser(Number(userId));
  }


  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }


  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.todoService.delete(+id);
  }

}
