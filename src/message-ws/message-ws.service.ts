import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
    [id: string] : {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessageWsService {

    private connectedClients: ConnectedClients = {};  

    constructor(

        @InjectRepository(User)
        private readonly userReposiotry: Repository<User>

    ) {}

    async registerClient ( client : Socket, userID: string ) {

        const user = await this.userReposiotry.findOneBy({ id: userID})

        if(!user) throw new Error("User not found");
        if(!user.isActive) throw new Error("User is not active");
        
        this.checkUser(user);

        this.connectedClients[client.id] = {
            socket: client, 
            user: user
        };
    }

    removeClient ( client : Socket ) {
        delete this.connectedClients[client.id];
    }

    getConnectedClients () {
        return Object.keys(this.connectedClients);
    }

    getUserName ( socketId: string) {
        return this.connectedClients[socketId].user.fullName;
    }

    private checkUser ( user: User ) {

        for( const clientId of Object.keys(this.connectedClients) ) {
            if(this.connectedClients[clientId].user.id === user.id) {
                this.connectedClients[clientId].socket.disconnect();
                break;
            }
        }

    }
}
