<template>
<div class="container">
    <div class="row">
        <not-found v-if="!$gate.isAdmin()" />
        <div class="col-12" v-if="$gate.isAdmin()">
            <div class="card mt-5">
                <div class="card-header">
                    <h3 class="card-title">Users Table</h3>
                    <div class="card-tools">
                        <button class="btn btn-success" @click="newModal">Add New <i class="fas fa-user-plus fa-fw"></i></button>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                    <table class="table table-hover">
                        <tbody><tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Registered Date</th>
                            <th>Modify</th>
                        </tr>
                        <tr v-for="user in users" :key="user.id">
                            <td>{{ user.id }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.type | uppercase }}</td>
                            <td>{{ user.created_at | mydate }}</td>
                            <td>
                                <a href="" class="btn btn-primary mr-2" @click.prevent="editModal(user)">
                                    <i class="fa fa-edit"></i>
                                </a>
                                <a href="#" class="btn btn-danger" @click.prevent="deleteUser(user.id)">
                                    <i class="fa fa-trash"></i>
                                </a>
                            </td>
                        </tr>
                        
                    </tbody></table>
                </div>
                <!-- /.card-body -->
            </div>
            <!-- /.card -->
        </div>
    </div>

            <!-- Modal -->
            <div class="modal fade" id="newModal" tabindex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 v-show="!editMode" class="modal-title" id="addModalLabel">Add New User </h5>
                    <h5 v-show="editMode" class="modal-title" id="addModalLabel">Update User's info </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="resetError">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                    <form @submit.prevent="editMode ? updateUser() : createUser()"> 

                  <div class="modal-body">
                        <div class="form-group">
                          <input v-model="form.name" type="text" name="name"
                            class="form-control" placeholder="Name" :class="{ 'is-invalid': form.errors.has('name') }">
                            <has-error :form="form" field="name"></has-error>

                        </div>
                        <div class="form-group">
                          <input v-model="form.email" type="email" name="email"
                            class="form-control" placeholder="Email" :class="{ 'is-invalid': form.errors.has('email') }">
                            <has-error :form="form" field="email"></has-error>
                        </div>
                        <div class="form-group">
                            <textarea v-model="form.bio" name="bio" id="bio"
                            placeholder="Short bio for user (Optional)"
                            class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                            <has-error :form="form" field="bio"></has-error>
                        </div>
                        <div class="form-group">
                          <select v-model="form.type" class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                              <option value="">Select User Role</option>
                              <option value="admin">Admin</option>
                              <option value="user">Standrad User</option>
                              <option value="Author">Author</option>
                          </select>
                          <has-error :form="form" field="type"></has-error>
                        </div>
                        <div class="form-group">
                          <input v-model="form.password" type="password" name="password"
                            class="form-control" placeholder="password" :class="{ 'is-invalid': form.errors.has('password') }">
                            <has-error :form="form" field="password"></has-error>
                        </div>
                  </div>
                  
                
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal" @click="resetError">Close</button>
                    <button v-show="!editMode"  type="submit" class="btn btn-primary"><i class="fas fa-spinner" v-if="loading" ></i> <span v-if="!loading">Create User</span></button>
                    <button  v-show="editMode" type="submit" class="btn btn-success"><i class="fas fa-spinner" v-if="loading" ></i> <span v-if="!loading">Update User</span></button>
                  </div>
                </form>

                </div>
              </div>
            </div>
</div>
</template>
<script>

export default {
    name: 'users',
    data(){
        return {
            editMode: false,
            loading: false,
            users: {},
            form: new Form({
                id: '',
                name : '',
                email : '',
                password : '',
                type : '',
                bio : '',
                photo : '',
            })
        }
    },
    methods:{
        resetError(){
            this.form.clear();
        },
        updateUser(){
            this.loading =true;
            this.$Progress.start();
            this.form.put(`/api/user/${this.form.id}`)
            .then(() => {
                this.$Progress.finish();
                $('.modal').modal('hide');
                toast({
                  type: 'success',
                  title: 'User edited successfully!'
                });
                this.loading =false;
                this.loadUser();
                this.form.reset();

            })
            .catch(() => {
                this.$Progress.fail();
                this.loading =false;
                toast({
                      type: 'error',
                      title: 'Please review input\'s'
                });
            });
        },
        editModal(user){
            this.editMode = true;
            this.form.reset();
            $('.modal').modal('show');
            this.form.fill(user);
        },
        newModal(){
            this.editMode = false;
            this.form.reset();
            $('.modal').modal('show');
        },
        createUser(){
            this.loading =true;
            this.$Progress.start();
            this.form.post('api/user')
            .then((response) => {
                setTimeout(() => {
                    this.$Progress.finish();
                    $('.modal').modal('hide');
                    toast({
                      type: 'success',
                      title: 'user created successfully!'
                    });
                    this.loading =false;
                    this.loadUser();
                    this.form.reset();
                } , 3000);
            })
            .catch((err) => {
            this.$Progress.fail();
            this.loading =false;
            toast({
                  type: 'error',
                  title: 'Please review input\'s'
            });
            });
            

        },
        deleteUser(id){
            Swal({
              title: 'Are you sure to delete user?',
              text: "You won't be able to revert this!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.value) {
                this.form.delete(`api/user/${id}`)
                    .then( () => {
                        Swal(
                          'Deleted!',
                          'User has been deleted.',
                          'success'
                        );
                        this.loadUser();
                    })
                    .catch(() => {
                        swal('Failed','There was someting wrong.','warning')
                    })
                    }
                })
        
        },
        loadUser(){
            if(this.$gate.isAdmin()){
                axios.get('api/user').then(({data}) => (this.users = data.data));
            }
        }
    },
    created(){
        this.loadUser();
    }
}
</script>