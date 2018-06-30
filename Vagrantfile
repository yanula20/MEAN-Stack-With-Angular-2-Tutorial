# -*- mode: ruby -*-
# vi: set ft=ruby :


Vagrant.configure(2) do |config|
    
    config.vm.define "web01" do |web01|
        web01.vm.box = "ubuntu/trusty64"
        web01.vm.hostname = "web01"
        web01.vm.network "private_network", ip: "192.168.33.13"
        web01.vm.synced_folder "/Users/donny/Mean", "/vagrant"
  

        web01.vm.provider "virtualbox" do |vb|
            vb.customize ["modifyvm", :id, "--name", "Blog"]
            vb.memory = "1024"
       
        end

        web01.vm.provision "shell", inline: <<-SHELL 
            sudo apt-get install software-properties-common -y
            sudo apt-add-repository ppa:ansible/ansible -y
            sudo apt-get install ansible -y
            sudo apt-get update -y
            sudo yes | apt-get install -f
        SHELL
    end    
end

