import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly userService: UserService
  ) { }

  // add(or create) todo based on user id
  async create(createTodoDto: CreateTodoDto, userId: number) {
    const todo: Todo = new Todo();
    todo.title = createTodoDto.title;
    todo.date = new Date().toLocaleString();
    todo.completed = false;
    todo.user = await this.userService.findUserById(userId);
    return await this.todoRepository.save(todo);
  }


  // find all completed todos based on user id 
  async findAllCompletedTodosByUser(userId: number): Promise<Todo[]> {

    return await this.todoRepository.find({
      relations: ["user"],
      where: { user: { id: userId }, completed: true }
    });

  }


  // find all not completed todos based on user id 
  async findAllNotCompletedTodosByUser(userId: number): Promise<Todo[]> {

    return await this.todoRepository.find({
      relations: ["user"],
      where: { user: { id: userId }, completed: false }
    });

  }


  // mark todo as completed based on todo id 
  async update(todoId: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    let foundTodo = await this.todoRepository.findOneBy({
      id: todoId,
    });

    if (!foundTodo) {
      throw new HttpException(
        `Todo with id ${todoId} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    // foundTodo = { ...foundTodo, ...updateTodoDto, completed: true };
    Object.assign(foundTodo, updateTodoDto);
    foundTodo.completed = true;
    return await this.todoRepository.save(foundTodo);
  }


  // delete todo based on todo id 
  async delete(todoId: number): Promise<Todo> {

    let foundTodo = await this.todoRepository.findOneBy({
      id: todoId,
    });

    if (!foundTodo) {
      throw new HttpException(
        `Todo with id ${todoId} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.todoRepository.delete(todoId);
    return foundTodo;
  }

}
